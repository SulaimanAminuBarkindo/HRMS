export const clearNotifications = (ntfEl) => {
    return function() {
        ntfEl.textContent = '0';
    }
}

export const formatDate = (date) => {
    const d = new Date(date) 
    const m = (`0${d.getMonth() +1}`).slice(-2) 
    const dy = (`0${d.getDate()}`).slice(-2) 
    const y = d.getFullYear() 
    const h = d.getHours() + 1 
    const min = d.getMinutes() + 1 
    const s = d.getSeconds() + 1 
    return { y, m, dy, h, min, s }
}