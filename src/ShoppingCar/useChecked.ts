import { useReducer, useEffect, useCallback } from 'react';

// 用id值作为key值来记录勾选状态
interface IOption {
  key?: string;
}

type CheckedMap = {
  [key: string]: boolean
}

const CHECKED_CHANGE = 'CHECKED_CHANGE';
const CHECKED_ALL_CHANGE = 'CHECKED_ALL_CHANGE';
const SET_CHECKED_MAP = 'SET_CHECKED_MAP';

// ?
type CheckedChange<T> = {
  type: typeof CHECKED_CHANGE
  payload: {
    dataItem: T
    checked: boolean
  }
}
type CheckedAllChange = {
  type: typeof CHECKED_ALL_CHANGE
  payload: boolean
}
type SetCheckedMap = {
  type: typeof SET_CHECKED_MAP
  payload: CheckedMap
}
type Action<T> = CheckedChange<T> | CheckedAllChange | SetCheckedMap
export type OnCheckedChange<T> = (item: T, checked: boolean) => any

// 主要逻辑
// 单选 全选 反选
// 筛选选中数据
export const useChecked = <T extends Record<string, any>>(
  dataSource: T[], { key = "id" }: IOption = {}
) => {
  const [checkedMap, dispatch] = useReducer((checkedMapParam: CheckedMap, action: Action<T>)=>{
    switch(action.type) {
      case CHECKED_CHANGE: {
        const { payload } = action;
        const { dataItem, checked } = payload;
        const { [key]: id} = dataItem;
        return {
          ...checkedMapParam,
          [id]: checked,
        }
      }
      case CHECKED_ALL_CHANGE: {
        const { payload: newCheckedAll } = action;
        const newCheckedMap: CheckedMap = {};
        // 全选
        if (newCheckedAll) {
          dataSource.forEach((dataItem) => {
            newCheckedMap[dataItem.id] = true;
          });
        }
        return newCheckedMap;
      }
      case SET_CHECKED_MAP: {
        return action.payload
      }
      default:
        return checkedMapParam;
    }
  }, {});

  // 改变勾选状态
  const onCheckedChange: OnCheckedChange<T> = useCallback((dataItem, checked) => {
    dispatch({
      type: CHECKED_CHANGE,
      payload: {
        dataItem,
        checked,
      }
    })
  }, []);

  type FilterCheckedFunc = (item: T) => boolean;

  const filterChecked = useCallback((func: FilterCheckedFunc = () => true)=>{
    return (
      Object.entries(checkedMap)
        .filter(entries => Boolean(entries[1]))
        .map(([checkedId]) => dataSource.find(({[key]: id}) => id === Number(checkedId)))
        .filter(Boolean)
        .filter(func as any) as T[]
    )
  }, [checkedMap, dataSource, key]);

  // 是否全选
  const checkedAll = dataSource.length !== 0 && filterChecked().length === dataSource.length;

  // 全选反选函数
  const onCheckedAllChange = (newCheckedAll: boolean) => {
    dispatch({
      type: CHECKED_ALL_CHANGE,
      payload: newCheckedAll,
    })
  }

  useEffect(() => {
    filterChecked().forEach((checkedItem) => {
      let changed = false;
      if (!dataSource.find(dataItem => checkedItem.id === dataItem.id))  {
        delete checkedMap[checkedItem.id];
        changed = true;
      }
      if (changed) {
        dispatch({
          type: SET_CHECKED_MAP,
          payload: Object.assign({}, checkedMap),
        });
      }
    });
  }, [dataSource, checkedMap, filterChecked]);

  return {
    checkedMap,
    dispatch,
    onCheckedChange,
    filterChecked,
    onCheckedAllChange,
    checkedAll
  }
}
