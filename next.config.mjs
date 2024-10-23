/** @type {import('next').NextConfig} */
const nextConfig = {
  // 根据环境变量决定是否使用静态导出
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // 如果您的项目不是部署在子目录，请移除或注释掉这行
  // basePath: '/your-base-path',

  // 这行可以移除，因为 'out' 是默认值
  // distDir: 'out',
};

export default nextConfig;
