import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from '~/utils/formatters'

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

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

// Khởi tạo một promise cho việc gọi api refreshToken
// Mục đích tạo promise này để khi nào gọi api refreshToken xong xuôi thì mới gọi lại các api bị lỗi trước đó (lỗi do accessToken hết hạn)
let refreshTokenPromise = null

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

    // Quan trọng;  xử lý refreshToken tự động
    // TH1: Nếu như nhận mã 401 (token không hợp lệ) từ BE, thì gọi api đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatchEvent(logoutUserAPI(false))
    }

    // TH2: Nếu nhận được mã 410 (token hết hạn) thì gọi api refreshToken để lấy accessToken mới
    const originalRequests = error.config
    if (error.response?.status === 410 && originalRequests) {
      // Kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refreshToken đồng thời gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Dù API có thành công hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then(accessToken => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

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