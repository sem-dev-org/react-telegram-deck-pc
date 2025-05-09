/*
 * @Author: HuangQS
 * @Date: 2025-05-05 21:52:57
 * @LastEditors: HuangQS 564479746@qq.com
 * @LastEditTime: 2025-05-08 01:07:48
 * @Description: 用于system的hooks
 * 功能：
 * 1.检查当前页面是否为移动端页面
 */
import { useState, useEffect } from 'react';

export function useSystem() {
  const [isMobile, setIsMobile] = useState((window?.innerWidth ?? 0) < 1080);

  // 检查页面是否为移动端页面
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1080);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // ===== 获取用户传参 =====
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    // 可以在这里获取所有URL参数
    const params = Object.fromEntries(searchParams.entries());
    console.log('URL参数:', params);

    // 也可以根据需要获取特定的参数
    const startappKey = searchParams.get('startapp');
    if (startappKey) {
      console.log(`GET!!! user from [${startappKey}]`);
      sessionStorage.setItem('startapp', startappKey);
    }

    return params;
  };

  /**
   * 当页面为网页形式时，跳转前往TG开启游戏
   * 关联getUrlParams方法,将用户携带的startapp参数携带导Tg游戏中
   * return true: 需要跳转(PC) false: 不用跳转
   */
  const checkPageNavToApp = (): boolean => {
    checkMobile();
    if (isMobile) return false;

    const startappKey = sessionStorage?.getItem('startapp') ?? '';
    let navToUrl = 'https://t.me/b03test_bot/app';
    if (startappKey) {
      navToUrl = `${navToUrl}?startapp=${startappKey}`; // 附带参数
    }
    // PC端时生效
    // 则打开新页面的方式 打开TG小游戏URL
    // window.open('https://t.me/b03test_bot/app', '_blank');
    // 则替换当前页面地址跳转到TG小游戏URL
    window.location.href = navToUrl;
    return true;
  };

  return { isMobile, getUrlParams, checkPageNavToApp };
}
