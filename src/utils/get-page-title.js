import defaultSettings from '@/settings'

const title = defaultSettings.title || '亚迦布科技销售系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
