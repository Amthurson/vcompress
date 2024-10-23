/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加输出配置
  output: 'export',
  
  // 如果您的项目不是部署在域名根目录,还需要设置 basePath
  // basePath: '/your-base-path',

  // 如果您需要将输出目录更改为 'out',可以添加以下配置
  distDir: 'out',
};

export default nextConfig;
