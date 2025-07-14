import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import querystring  from "querystring";

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import pinia from "./stores";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "./router/config.ts"

const app=createApp(App)


app.config.globalProperties.$querystring=querystring
app.use(pinia)
app.use(TDesign);
app.use(ElementPlus)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn
})

app.mount('#app')
