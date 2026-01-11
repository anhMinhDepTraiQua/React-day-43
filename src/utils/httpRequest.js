import axios from "axios";

const httpRequest = axios.create({
    baseURL: "https://api01.f8team.dev/api",
});

let isRefreshing = false;
let queueJobs = [];

httpRequest.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
      
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        console.log(" Không có token!"); 
    }

    return config;
});
httpRequest.interceptors.response.use(
    (response) => {
        return response.data;
    },

    async (error) => {
        console.log("❌ Response lỗi:", error.response?.status, error.config?.url); // Debug
        
        const refreshToken = localStorage.getItem("refreshToken");

        if (error.response?.status === 401 && refreshToken) {
            const original = error.config;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    console.log("🔄 Đang refresh token..."); // Debug
                    
                    const response = await axios.post(
                        `${import.meta.env.VITE_BASE_API}/auth/refresh-token`,
                        { refresh_token: refreshToken }
                    );

                    const { access_token, refresh_token: newRefreshToken } = response.data.data;

                    localStorage.setItem("accessToken", access_token);
                    localStorage.setItem("refreshToken", newRefreshToken);
                    
                    console.log("✅ Refresh token thành công!"); // Debug

                    // Resolve tất cả các request đang chờ
                    queueJobs.forEach((job) => job.resolve());
                    queueJobs = [];
                    
                    isRefreshing = false;
                } else {
                    // Đợi refresh token hoàn thành
                    await new Promise((resolve, reject) => {
                        queueJobs.push({ resolve, reject });
                    });
                }

                // Thử lại request với token mới
                return await httpRequest.request(original);
            } catch (refreshError) {
                console.error("❌ Refresh token thất bại:", refreshError); // Debug
                
                // Reject tất cả request đang chờ
                queueJobs.forEach((job) => job.reject(refreshError));
                queueJobs = [];
                
                isRefreshing = false;
                
                // Xóa token và redirect về login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                
                // Nếu dùng React Router, có thể redirect:
                // window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default httpRequest;