/** @type {import('next').NextConfig} */
const nextConfig = {
  // 根据环境变量决定是否使用静态导出
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  
  // 如果您的项目不是部署在域名根目录,还需要设置 basePath
  basePath: '/your-base-path',

  // 如果您需要将输出目录更改为 'out',可以添加以下配置
  distDir: 'out',
};

export default nextConfig;
