// Manda o elemento, faz o comando e retorna
let cart = [];
let modalQt = 1;
let modalKey = 0;
const select = (el)=>document.querySelector(el);
const selectAll = (el)=>document.querySelectorAll(el);



//Listagem de pizzas
pizzaJson.map((item, index)=>{
        // Clonando informações do .models .pizza-item
        let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
        //Preenchendo informações em pizza item
        pizzaItem.setAttribute('data-key', index);
        pizzaItem.querySelector('.pizza-item--img img').src = item.img;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `$ ${item.price.toFixed(2)}`;
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

       

        //Abrindo modal de pizza e adicionando informações da pizza
        pizzaItem.querySelector('a').addEventListener('click', function(e){
            e.preventDefault();
            let key = e.target.closest('.pizza-item').getAttribute('data-key');//Pega a pizza
            modalQt = 1;//Reseta quantidade de pizza
            modalKey = key;//Mostra qual é a pizza

            select('.pizzaBig img').src = pizzaJson[key].img;
            select('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            select('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            select('.pizzaInfo--price .pizzaInfo--actualPrice').innerHTML = `$ ${pizzaJson[key].price.toFixed(2)}`;
            select('.pizzaInfo--size.selected').classList.remove('selected');

            selectAll('.pizzaInfo--sizes .pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                    size.classList.add('selected');
                }

                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
           });

            select('.pizzaInfo--qt').innerHTML = modalQt;
           
            select('.pizzaWindowArea').style.opacity = 0;
            select('.pizzaWindowArea').style.display = 'flex';
           setTimeout(()=>{
            select('.pizzaWindowArea').style.opacity = 1;
           },200);

           

        });

    //Listar pizzas no site
    select('.pizza-area').append(pizzaItem); //append adiciona novos itens
   

});


// Eventos do modal
//Fechar o modal
function closeModal(){
    select('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        select('.pizzaWindowArea').style.display = 'none';
    },500);
}
   
selectAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// Remove quantidade de pizza
select('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
   if(modalQt > 1){
    modalQt--;
    select('.pizzaInfo--qt').innerHTML = modalQt;
   }
});

//Adiciona quantidade de pizza
select('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    select('.pizzaInfo--qt').innerHTML = modalQt;
});

//Selecionando tamanho da pizza
selectAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        select('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');    
});             


});
//Adicionando pizzas ao carrinho de compras
select('.pizzaInfo--addButton').addEventListener('click', ()=>{
         let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'));// pega o tamanho da pizza
    
    cart.push({
        id:pizzaJson[modalKey].id,
        size,
        qt: modalQt
    });
    cartUpdate();
    closeModal();
});

select('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0) {
        select('aside').style.left = '0';
    }
});

select('.menu-closer').addEventListener('click', ()=>{
    select('aside').style.left = '100vw';
});


// Função atualizar carrinho
function cartUpdate(){

    select('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {//Mostra o carrinho
        select('aside').classList.add('show');
        
        //zerando o carrinho
        select('.cart').innerHTML = '';

        // variaveis
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        //preenche informações no carrinho
        for(let i in cart){

            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = select('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0: 
                     pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


             cartItem.querySelector('img').src = pizzaItem.img;
             cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
             cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

             cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                    
                }else{
                    cart.splice(i,1);
                   
                }

                cartUpdate();
             });

             cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                cartUpdate();
            });

            select('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        select('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        select('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        select('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        
    }else{//Esconde o carrinho
        select('aside').classList.remove('show');
        select('aside').style.left = '100vw';
    }
}