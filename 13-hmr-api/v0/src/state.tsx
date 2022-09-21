export const initState = () => {
  let count= 0;

  setTimeout(() => {
    let countELe = document.getElementById('count');
    countELe!.innerHTML = ++count + '';
  }, 1000);

}