# 部署架构（阶段 4/5 · 北京服务器 + 已备案域名）

```
tavern.<域名>/            → slides 静态站（观众扫码回看）+ /guide/ 指南
tavern.<域名>/live/       → proxy（反代，持有 Key，IP 限流）
play.<域名>/              → SillyTavern 实例（阶段 5；子域名不另需备案）
```

## 前置条件（缺一不开工）
- [ ] 北京服务器 SSH 就绪（本手册假定 Ubuntu 22.04+ / Debian 12）
- [ ] 域名解析到位：`tavern.<域名>` A 记录；`play.<域名>` A 记录（同服务器）
- [ ] 备案可用于子域名
- [ ] `deepseek-key.txt` 内容已转移到服务器密钥存放处（**永不进 git**）

## 步骤概览

### 1. 同步代码
```bash
rsync -av --exclude node_modules --exclude .git \
  ./ user@<server>:/opt/st-pre/
```

### 2. 静态站 + proxy（nginx + systemd）
```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/tavern.conf
sudo ln -s /etc/nginx/sites-available/tavern.conf /etc/nginx/sites-enabled/
# 编辑 server_name 与证书路径
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d tavern.<域名>          # Let's Encrypt
# proxy 常驻：
sudo cp deploy/st-pre-proxy.service.example /etc/systemd/system/
sudo systemctl enable --now st-pre-proxy
```

### 3. 体验站（阶段 5 · 需用户确认规模后执行）
```bash
cd /opt/st-pre/deploy && docker compose up -d
# 建号：admin 登录后调用 users-admin HTTP 端点批量建 u001~N
# （handle 规则：小写字母/数字/短横线）
```

## 安全清单（发布前逐项打勾）
- [ ] HTTPS 生效（http 强制跳转）
- [ ] proxy 只暴露 `/live/` 路径，其余 403；限流已生效（默认 10 req/min/IP）
- [ ] DeepSeek Key 只存在于 systemd env 或 .env（权限 600），`grep -r sk- /opt/st-pre --include="*.js" --include="*.html"` 为空
- [ ] ST：`enableUserAccounts` + `enableDiscreetLogin` 开启
- [ ] ⚠ ST 官方明示：多用户密码「非安全特性」、全部数据明文存储——仅限社团可信范围使用；反代限流；定期备份 `data/`；敏感内容不上
- [ ] 定时备份：`crontab` 每日打包 `/opt/st-pre/deploy/st-data` 与 slides
- [ ] 服务器 sshd 禁密码登录（仅密钥）
- [ ] 手机扫码全链路验证：扫码 → HTTPS 页面 → 指南/回放/体验站 三路都通
