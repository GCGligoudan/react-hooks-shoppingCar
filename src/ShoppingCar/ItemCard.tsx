import React from 'react';
import { Typography } from 'antd';
import { ICartItem } from './index';
import { OnCheckedChange } from './useChecked';

interface IProps {
  item: ICartItem
  checked: boolean
  onCheckedChange: OnCheckedChange<ICartItem>
}

function isEqual(prevProps: IProps, nextProps: IProps) {
  return prevProps.checked === nextProps.checked;
}

const ItemCard = React.memo((props: IProps) => {
  const { item, checked, onCheckedChange } = props;
  const { name, price } = item;

  const onWrapCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onCheckedChange(item, checked);
  }

  return (
    <div className="item-card">
      <div className="checkbox-wrap">
        <input 
          type="checkbox"
          checked={checked}
          onChange={onWrapCheckedChange}
        />
      </div>
      <p className="item-info">{name} <Typography.Text>${price}</Typography.Text></p>
    </div>
  )
}, isEqual);

export default ItemCard;
