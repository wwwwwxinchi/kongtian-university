# 2026-10-10 校园卡活动验收

- 本地 `python test_server.py` 通过，覆盖默认关闭、无权限访问、登录失败、同源限制、开关持久化、文件名路径校验、无效/截断 PNG、同名替换、搜索、下载与注销会话。
- 本地及公网 `https://kongtian.university` 的真实 Chromium 流程通过：从制作页填写姓名学号，下载 PNG，管理员登录，打开接收，点击打印上传，后台下载，更改本科/研究生卡面后用相同文件名再次提交，确认只剩一个文件，关闭接收后再次提交返回 403，注销后列表和图片返回 401。
- 公网本地下载与首次管理下载 SHA-256 均为 `f49b6bc743d687f722008c5bc91ad0727e0bb7d4de3a67eeb886d4fc2092cd1f`；替换后为 `3b4a30cd54caba2371f9a78f23bc165667ce0c2c0e6f6a53d43af455e8b1ead8`，确认最新图片替代原图。
- 已检查桌面首页、制作页、管理页与 390px 手机宽度截图。手机无横向溢出。使用真实素材，卡面像素与 DPI 沿用原工具。没有进行实体打印机出纸验收。
- `nginx -t` 通过；`campus-card` systemd 服务 active。重启服务后 `accepting:false` 仍保持，公网 `/api/campus-card/status` 返回相同结果。www 子域制作页返回 200。
- 仅删除明确命名的测试图片 `活动验收001000010.png`。验收结束时上传目录为空，接收开关关闭。
- 部署前线上首页 SHA-256 与本地 main 基线一致。备份路径 `/var/backups/campus-card/20261009T164303Z`（UTC）。部署后根磁盘可用约 5.7 GiB，独立服务内存约 15 MB。

浏览器截图和测试下载在本机 `D:/esorakodo/card-activity-output/`。管理员凭据单独交付于 `D:/esorakodo/campus-card-private/admin-credentials.txt`，不纳入 Git 或公开目录。
