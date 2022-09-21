let timmer: number | undefined;

if (import.meta.hot) {
  // 初始化 count;
  if (!import.meta.hot.data.count) {
    import.meta.hot.data.count = 0;
  }

  import.meta.hot.dispose((mode) => {
    console.log('dispose=>', mode)
    if (timmer) {
      clearInterval(timmer)
    }
  })
}


export const initState = () => {
  const getAndIncCount = () => {
    const data = import.meta.hot?.data || { count: 0 };

    data.count = data.count + 1;

    return data.count
  }


  timmer = setInterval(() => {
    let countELe = document.getElementById('count');
    countELe!.innerHTML = getAndIncCount() + '';
  }, 1000);

}