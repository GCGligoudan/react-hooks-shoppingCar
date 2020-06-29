import React from 'react';
import { List, Typography } from 'antd';
import ItemCard from './ItemCard';
import { useChecked } from './useChecked';
import './index.css';

export interface ICartItem {
  id: number
  name: string
  price: number
}

const cartData = Array(5)
  .fill(undefined)
  .map((value, index) => ({
    id: index,
    name: `商品${index}`,
    price: Math.round(Math.random() * 100)
  }));

function ShoppingCar() {
  const {
    checkedAll,
    checkedMap,
    onCheckedAllChange,
    onCheckedChange,
    filterChecked,
  } = useChecked(cartData);

  const sumPrice = (cartItems: ICartItem[]) =>{
    return cartItems.reduce((sum,cur) => sum + cur.price, 0);
  }

  const onWrapCheckedAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkedAll = e.target.checked;
    onCheckedAllChange(checkedAll);
  }

  const total = sumPrice(filterChecked())

  const Header = (
    <div><h3>购物车</h3></div>
  )
  const Footer = (
    <div className="footer">
      <div className="check-all">
        <input 
          checked={checkedAll}
          onChange={onWrapCheckedAllChange}
          type="checkbox" 
        /> 全选
      </div>
      <div>价格总计：<Typography.Text>${total}</Typography.Text></div>
    </div>
  );

  return (
    <div className="cart">
      <List
        header={Header}
        footer={Footer}
        bordered={true}
        dataSource={cartData}
        renderItem={item => {
          const checked = checkedMap[item.id] || false
          return (
            <List.Item>
              <ItemCard item={item} checked={checked} onCheckedChange={onCheckedChange}></ItemCard>
            </List.Item>
          )
        }}
      ></List>
    </div>
  )
}

export default ShoppingCar;
