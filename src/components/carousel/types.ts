/**
 * 基础轮播控制接口
 * 定义所有轮播组件共享的控制方法
 */
export interface BaseCarouselHandle {
  /** 滚动到下一页 */
  scrollNext: () => void;
  /** 滚动到上一页 */
  scrollPrev: () => void;
}

/**
 * 扩展的轮播控制接口
 * 可以在未来添加更多高级控制方法
 */
export interface ExtendedCarouselHandle extends BaseCarouselHandle {
  /** 滚动到指定索引 */
  scrollTo?: (index: number) => void;
  /** 获取当前索引 */
  getCurrentIndex?: () => number;
}
