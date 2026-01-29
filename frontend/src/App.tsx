import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import router from './router'
import './index.css'

function App() {
  return (
    <StrictMode>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </StrictMode>
  )
}

export default App
