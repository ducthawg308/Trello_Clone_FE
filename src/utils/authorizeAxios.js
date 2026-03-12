import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo một đối tượng Axios mục đích để custom và cấu hình chung cho dự án
const authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptor
// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  }, (error) => {
    // Do something with request error
    return Promise.reject(error)
  } 
)

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
    // Mọi mã status code nằm trong khoảng 200 - 299 là success và nó sẽ rơi vào đây
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)

    return response
  }, (error) => {
    // Mọi mã status code nằm ngoài khoảng 200 - 299 là error và nó sẽ rơi vào đây
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    // Dùng toast để hiển thị bất kể mọi mã lỗi lên màn hình. Ngoại trừ mã 410 vì mã này phục vụ việc refresh token
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  })

export default authorizedAxiosInstance