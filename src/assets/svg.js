const files = import.meta.globEager('./svg/*.svg')


export default (app) => {
    const nameRegex = /svg\/(.*?)\.svg/
    // 因为通过 import.meta.globEager 返回的列表不能迭代所以直接使用 Object.keys 拿到 key 遍历
    Object.keys(files).forEach((c) => {
        const name = c.match(nameRegex)[1]
        const component = files[c].default
        // 挂载全局控件
        app.component('icon-' + name, component)
    })
}