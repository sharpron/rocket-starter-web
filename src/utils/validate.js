/**
 * 密码规则
 */
export const PASSWORD_REGEX =
  /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/

/**
 * 手机号正则
 */
export const MOBILE_REGEX =
  /^((13\d)|(14[014-9])|(15[0-3,5-9])|(16[2567])|(17[0-8])|(18\d)|(19[0-3,5-9]))\\d{8}$/

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
