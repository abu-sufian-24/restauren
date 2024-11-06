

let activeFoodItem = [];
let activeCardItem = [];
   


init()

function menu_responsive() {
     let menuToggle = document.getElementById('menu-toggle');
    let menuList = document.getElementById('menu-list');

    menuToggle.addEventListener('click', function () {
      menuList.classList.toggle('active');
      
    });
};

// ****************** Function Init **************************
function init() {
  menu_responsive()
  foodElement() 
  appendFoodItemToHtml('https://course.divinecoder.com/food/random/6');
  cartItemCount()
  removeCartItem() 
  
  
}

// ****************** Helper Functions **************************

function foodCard(food) {
  return`<div class="col-lg-4 mb-4 col-md-6">
          <div class="food-cart-item">
            <div class="img position-relative">
              <img class="img-fluid w-100" src=${food.image} alt="img">
              <div class="overly position-absolute d-flex align-items-center">
                <span>Price: ${food.price}=</span>
                <i class="fa-solid fa-star"></i>
                <span>${food.rating} ${food.rating_count}</span>
              </div>
            </div>
            <div class="text ">
              <h4 class="pb-2">${food.name}</h4>
              <ul class="list-unstyled d-flex flex-wrap">
                <li>4 chicken legs</li>
                <li>Chili sauce</li>
                <li>4 chicken legs</li>
                <li>Chili sauce</li>
                <li>Soft Drinks</li>
                <li>Chili sauce</li>
              </ul>
            </div>
            <a href="#" data-id="${food.id}" class="${food.isAddetToCart ? "active" : ''} add-to-cart d-flex justify-content-center align-items-center">
              <i class="fa-solid fa-cart-shopping"></i>
              <span>${food.isAddetToCart ? "Added To Cart" : 'Add To Cart'}</span>
            </a>
          </div>
        </div>`
}

async function appendFoodItemToHtml(link, callback = () =>{}) {
  try {
    let respons = await fetch(link)
    let data = await respons.json()
    document.getElementById('food-area').innerHTML = '';
    data = Array.isArray(data) ? data : data.data;

    activeFoodItem = data.map(item => {
      let cheackActivety = activeCardItem.some(activeItem => {
        return activeItem.id == item.id;
      })
      return {
        ...item,
        isAddetToCart: cheackActivety,
      }
    })
    
    

    // let finalElement = data.map(food => {
    //     document.getElementById('food-area').innerHTML += foodCard(food);
    // });
    // let test = data.map(food => {
    //   return foodCard(food)
    // })
    // document.getElementById('food-area').innerHTML = test.join('')
     document.getElementById('food-area').innerHTML = activeFoodItem.map(food => foodCard(food)).join('')

    callback()
    addToCartHandler()
  } catch (error) {
    console.log(error);
  }
} 

function appendCartItemHtmlToPopap() {
  let htmlElement = (food) => {
    return `   <tr>
                <td>
                  <img src="${food.image}" alt="">
                </td>
                <td>
                  <span class="title">${food.name}</span>
                </td>
                <td>
                  <span class="price">tk:${food.price}</span>
                </td>
                <td>
                  <div class="quantity-area d-flex align-items-center">
                    <span class="quantity d-block mr-2">${food.quantity}</span>
                    <div class="plus-minus">
                      <ul class="d-flex list-unstyled m-0">
                        <li class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-minus"></i>
                        </li>
                        <li class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-plus"></i>
                        </li>
                      </ul>
                    </div>
                  </div>

                </td>
                <td>
                  <span class="total">tk:${food.total}</span>
                </td>
                <td>
                  <span class="action">
                  <i data-id="${food.id}" class="delet-cart-item fa-solid fa-trash-can"></i>
                  </span>
                </td>
              </tr>`
  }

  let cartItemLooping = activeCardItem.map(food => {
    return htmlElement(food);
  })
  document.getElementById('cart-item-table').innerHTML = cartItemLooping.join('')
}


// ****************** Handler Functions **************************
async function foodElement () {
  try {
    let respons = await fetch('https://course.divinecoder.com/food-categories')
    let data = await respons.json()
    document.getElementById('menu-items').innerHTML = ''
    document.getElementById('menu-items').innerHTML = data.map(item => ` <li data-id ="${item.id}"><a href="#">${item.name}</a></li>`).join('')

    // data.forEach(item => {
    //    document.getElementById('menu-items').innerHTML +=
    // }) 

    foodItemsByCategory()
  } catch (error) {
    console.log(error);
  }
}

// async function randomFoods() {
  
// }

function foodItemsByCategory() {
  let list = document.querySelectorAll('#menu-items li');
  let finalList = Array.from(list).map(menu => {
    menu.addEventListener('click',function (event) {
      event.preventDefault();
      let categoryId = menu.getAttribute('data-id')
      menu.classList.add('active');

      appendFoodItemToHtml(`https://course.divinecoder.com/food/by-category/${categoryId}/6`,()=> {
        menu.classList.remove('active');
      })
    })
   })
}

function cartItemCount() {
  let cartCountElement = document.querySelectorAll('.cart-item-count');
  let count = activeCardItem.length;
  count = count > 9 ? count : "0" + count;
  Array.from(cartCountElement).forEach((element) => {
    
    if (count > 0) {
      element.classList.remove('d-none')
    } else {
      element.classList.add('d-none')
    }
    element.textContent = count;
  })

  
  
}

function addToCartHandler() {

  let addToCartBtn = document.querySelectorAll('.add-to-cart');

  Array.from(addToCartBtn).forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      let id = btn.getAttribute('data-id');
      

      let cartItem = activeFoodItem.find(item => {
        return item.id == id;
      })

      let checkAktivety = activeCardItem.some(item => item.id == id);

      
      if (checkAktivety == false) {
        activeCardItem.push({
          id: cartItem.id,
          image: cartItem.image,
          name: cartItem.name,
          price:Number( cartItem.price),
          quantity: 1,
          total: Number(cartItem.price),
        });
      }
      
      
      
      cartItemCount()
      appendCartItemHtmlToPopap()
      changeButtonDesing(id)
      totalCount()
      
    })
  })
  
  
}

function changeButtonDesing(id) {
  let myButton = document.querySelector(`.add-to-cart[data-id="${id}"]`);
  myButton.classList.toggle('active');

  if (myButton.classList.contains('active')) {
    myButton.querySelector('span').textContent = 'Added To Cart';
  } else {
     myButton.querySelector('span').textContent = 'Add To Cart';
   }
}

function removeCartItem() {
  let cartTable = document.getElementById('cart-item-table');
 
  cartTable.addEventListener('click',(event)=> {
   
    if (event.target.classList.contains('delet-cart-item')) {

      let id = event.target.getAttribute('data-id');

      
      activeCardItem = activeCardItem.filter(function (item){
        return item.id !=id
      })

      appendCartItemHtmlToPopap()
      cartItemCount()
      changeButtonDesing(id)
    }
  })
   
  
}

function totalCount() {
  let count = activeCardItem.reduce((total, ranningNumber) => {
    return total + ranningNumber.total;
  },0)
  let totalText = `Total Amount: ${count} Tk`;
  document.getElementById('total-count-element').innerHTML = totalText;


}

  
