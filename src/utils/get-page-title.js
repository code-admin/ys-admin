import defaultSettings from '@/settings'

const title = defaultSettings ? defaultSettings.title : '登录' || '亚设管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
