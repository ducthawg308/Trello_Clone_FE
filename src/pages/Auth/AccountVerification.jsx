import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)
  
  // Call API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [])

  // Nếu URL có vấn đề (không tồn tại email hoặc token) thì đá ra trang 404
  if (!email || !token) {
    return <Navigate to="/404" replace={true}/>
  } 

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account"/>
  }
  // Nếu không gặp vấn đề gì + verify thành công thì điều hướng về trang login cùng data verifiedEmail
  return (
    <Navigate to={`/login?verifiedEmail=${email}`}/>
  )
}

export default AccountVerification