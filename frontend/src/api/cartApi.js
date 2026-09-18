import axios from "axios";
import { toast } from "sonner";
import { setCart } from "@/redux/restaurantSlice";
// import { useDispatch } from "react-redux";

const apiURL = `${import.meta.env.VITE_URL}/api/v1`;

export const loadCart = async (dispatch, setLoading = null) => {
    // const dispatch = useDispatch();
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            return null;
        }

        const res = await axios.get(
            `${apiURL}/cart`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.data.success) {
            dispatch(setCart(res.data.cart));

            return res.data.cart;
        }

        return null;

    } catch (error) {
        console.log(
            "Error loading cart:",
            error.message
        );

        toast.error(
            error.response?.data?.message ||
            "Failed to load cart!"
        );

        return null;

    } finally {
        if (setLoading) {
            setLoading(false);
        }
    }
};