import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import {createPinia} from 'pinia'
import querystring  from "querystring";

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';


const app=createApp(App)
const pinia=createPinia()

app.config.globalProperties.$querystring=querystring
app.use(pinia)
app.use(TDesign);
app.use(ElementPlus)
app.use(router)


app.mount('#app')
