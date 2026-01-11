import { useEffect, useState } from "react"
import { useLoginMutation } from "../services/auth";
import { useNavigate } from "react-router-dom"; 

export default function Login() {
    const [email, setEmail] = useState("sondang@f8.edu.vn");
    const [password, setPassword] = useState("12345678");
    const [login, response] = useLoginMutation();
    const navigate = useNavigate(); 

    useEffect(() => {
        if (response.isSuccess) {
            const { access_token, refresh_token } = response.data.data;
            
            console.log("🔑 Saving tokens..."); // Debug
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token); 
            
            console.log("✅ Tokens saved! Redirecting..."); // Debug
            
            // ✅ Navigate sau khi lưu token
            navigate("/"); // Hoặc navigate("/home")
        }
        
        if (response.isError) {
            console.error("❌ Login failed:", response.error);
        }
    }, [response, navigate]); // ✅ Thêm navigate vào dependency array

    function handleLogin(e) {
        e.preventDefault();
        
        console.log("📤 Logging in..."); // Debug
        
        const credentials = {
            email,
            password
        };
        
        login(credentials);
    }

    return (
        <div>
            <h1>Login Page</h1>
            <br />
            <form onSubmit={handleLogin} className="">
                <input 
                    type="text" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control mb-2 border-0 shadow-sm"
                />
                <br />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control mb-2 border-0 shadow-sm"
                />
                <br />
                <button 
                    type="submit" 
                    className="p-4 bg-[blue] text-[white] border-0 shadow-sm cursor-pointer"
                    disabled={response.isLoading} // ✅ Disable khi đang loading
                >
                    {response.isLoading ? "Đang đăng nhập..." : "Login"}
                </button>
            </form>
            
            {/* ✅ Hiển thị trạng thái */}
            {response.isError && (
                <p style={{color: 'red', marginTop: '10px'}}>
                    Đăng nhập thất bại! Vui lòng thử lại.
                </p>
            )}
            {response.isSuccess && (
                <p style={{color: 'green', marginTop: '10px'}}>
                    Đăng nhập thành công! Đang chuyển trang...
                </p>
            )}
        </div>
    );
}