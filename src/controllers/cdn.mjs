import express from 'express';
import expressJwt from 'express-jwt';
import qcCdn from 'qcloud-cdn-node-sdk';
import { expressJwtOptions } from '../utils.mjs';
import { error, cdnConfig } from '../config.mjs';

const router = new express.Router();

qcCdn.config({
  secretId: cdnConfig.appId,
  secretKey: cdnConfig.appKey,
});

/**
 * 域名列表查询
 * 接口文档：https://cloud.tencent.com/document/product/228/3937
 */
router.get(
  '/hosts',
  expressJwt(expressJwtOptions),
  (req, res) => {
    const {
      detail, // 是否显示详细信息
      project_id, // 所在项目
      host_type, // 接入方式
      status, // 状态
    } = req.query;

    qcCdn.request('DescribeCdnHosts', {
      detail: detail || 0,
    }, (res2) => {
      const result = JSON.parse(res2);

      // 正确获得域名列表
      if (result.code === 0) {
        let { hosts } = result.data;

        // 根据项目ID进行过滤
        if (project_id) {
          hosts = hosts.filter(host => host.project_id === parseInt(project_id, 10));
        }

        // 根据接入方式进行过滤
        if (host_type) {
          hosts = hosts.filter(host => host.host_type === host_type);
        }

        // 根据状态进行过滤
        if (status) {
          hosts = hosts.filter(host => host.status === parseInt(status, 10));
        }
        res.success(hosts);
      } else {
        error('获取CDN域名列表失败：', result);
        res.fail(result);
      }
    });
  },
);

/**
 * 刷新URL
 * 接口文档：https://cloud.tencent.com/document/product/228/3946
 */
router.post(
  '/refresh/url',
  expressJwt(expressJwtOptions),
  (req, res) => {
    qcCdn.request('RefreshCdnUrl', req.body, (res2) => {
      const result = JSON.parse(res2);
      // 正确执行
      if (result.code === 0) {
        res.success(result.data);
      } else {
        error('刷新URL失败：', result);
        res.fail(result);
      }
    });
  },
);

export default router;
