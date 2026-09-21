  
  const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        // Validate image type
        if (!selectedFile.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            e.target.value = "";
            return;
        }

        // Validate image size
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5 MB");
            e.target.value = "";
            return;
        }

        try {
            setIsUploading(true);

            const cloudName =
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

            const uploadPreset = "profile_images";

            if (!cloudName) {
                toast.error("Cloudinary cloud name is missing");
                return;
            }

            const formData = new FormData();

            formData.append("file", selectedFile);
            formData.append("upload_preset", uploadPreset);

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );

            const imageUrl = response.data?.secure_url;

            if (!imageUrl) {
                toast.error(
                    "Image URL was not returned by Cloudinary"
                );
                return;
            }

            setUpdateUser((prev) => ({
                ...prev,
                profilePic: imageUrl,
            }));

            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(
                "Cloudinary upload error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.error?.message ||
                    "Image upload failed"
            );
        } finally {
            setIsUploading(false);

            // Allow selecting same image again
            e.target.value = "";
        }
    };