import { defineStore } from 'pinia'

export const useTimerStore = defineStore('timer', {
    state: () => ({
        countdown: 0, // 倒计时秒数
        intervalId: null,
    }),
    actions: {
        startTimer() {
            this.countdown=60;
            if (this.intervalId) return; // 如果计时器已经在运行，则不重复启动
            this.intervalId = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    this.stopTimer();
                }
            }, 1000);
        },
        stopTimer() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
    },
});