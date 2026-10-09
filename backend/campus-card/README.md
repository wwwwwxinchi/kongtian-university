# 校园卡活动后端

活动分支 `activity/campus-card-backend`；前端在 `activity/campus-card`。不合并常驻官网分支。Python 3 标准库服务，由 nginx 转发 `/api/campus-card/`，监听 `127.0.0.1:3118`。

## 行为

- 制作和本地下载始终可用；只有点击「打印」才上传。
- 管理员 `admin` 通过随机初始密码登录。8 小时会话；HttpOnly、Secure、SameSite=Strict cookie；重启服务后重新登录。
- 接收开关默认关闭，保存在 `/var/lib/campus-card/settings.json`。保存前再次检查开关。关闭不删除已有图片。
- 图片在 `/var/lib/campus-card/images`，不在网站根目录；列表、预览和下载均需登录。
- 文件名沿用前端 `姓名+学号.png`。同名原子替换，不保存旧版本；文件修改时间表示最新提交时间。不同姓名和学号若拼接成相同名称，也按同名处理。
- 单图最大 4 MiB，验证 PNG 校验和、像素格式及 1016×638 尺寸。图片总量默认 1 GiB，磁盘剩余低于 1 GiB 时拒绝写入。参数 `CARD_QUOTA` / `CARD_MIN_FREE` 可调整。每 IP 每分钟最多提交 20 次。
- 登录每 IP 5 分钟最多 8 次尝试。上传、登录、设置校验同源 Origin。
- 图片不自动过期；活动停止后保留图片，便于下载。前端按文件名搜索、更新时间排序，每页 24 张。

## 配置与部署

`/etc/campus-card.env` 权限 600，包含 `CARD_DATA`、`CARD_PORT`、`CARD_ORIGINS`、`CARD_SECURE_COOKIE=1` 和 `CARD_PASSWORD_HASH`。密码哈希格式为 `saltHex:pbkdf2Sha256Hex`，600000 次迭代。凭据禁止提交 Git。

本地验证：`python test_server.py`。前端浏览器验收需覆盖真实 PNG 下载、登录、开关、覆盖、移动端与未登录拒绝读取。

发布目录包含本目录的 `server.py`、`campus-card.service`、`nginx.conf`、`deploy.sh`、独立传输的 `campus-card.env`，以及包含 `index.html`、`css/campus-card-event.css`、`campus-card/`、`assets/campus-card-front.webp`、`assets/campus-card-back.webp` 的 `frontend.tar.gz`。执行 `sh deploy.sh`。已有配置不会覆盖。部署前确认线上首页与活动基线相同。

脚本备份首页和 nginx 配置至 `/var/backups/campus-card/<UTC时间>`。保持其他网站配置不变，`nginx -t` 成功后才 reload。后端使用独立系统用户、只读系统目录和 192 MiB 内存上限。

## 活动结束与回退

先在管理页关闭接收，再下载需要的图片。要移除活动入口，恢复备份首页；要彻底下线活动，移除官网 nginx 中 `include /etc/nginx/snippets/campus-card.conf;` 并添加 `location ^~ /campus-card/ { return 404; }` 和 `location ^~ /api/campus-card/ { return 404; }`，检查 `nginx -t` 后 reload，然后 `systemctl disable --now campus-card`。图片与凭据保留，不删除用户提交的数据。活动期间若官网有其他更新，应仅删除入口模块，不用旧首页覆盖后续改动。

密码更换：离线生成新随机密码和 PBKDF2 哈希，更新 `/etc/campus-card.env` 后重启服务；切勿把明文密码写入脚本、日志或 Git。
