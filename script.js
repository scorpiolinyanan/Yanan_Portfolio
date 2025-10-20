// --- GSAP intro ---
gsap.from(".header", { opacity: 0, y: -30, duration: 1 });
// gsap.from(".gallery img", { opacity: 0, y: 40, stagger: 0.1, duration: 1.2 });
let view = "slider"

// 检查是否为移动设备
function isMobileDevice() {
  return window.innerWidth <= 768;
}
document.addEventListener("DOMContentLoaded", () => {
  const images = Array.from(document.querySelectorAll(".gallery-track .image-link"));
  let gap = 20;
  
  // 初始化时记录尺寸
  const imgW = 400;
  const imgH = 250;
  
  const imgWidth = images[0].offsetWidth + gap;
  const total = images.length;
  const totalWidth = total * imgWidth;
  let scrollX = 0;
  const speed = 80; // 鼠标滚轮灵敏度
  const positions = [];

  // 初始化时计算并设置slider图片位置
  function initializeSliderPositions() {
    const mobileScale = isMobileDevice() ? 1 : 1;
    const currentWidth = imgW * mobileScale;
    const currentHeight = imgH * mobileScale;
    const currentGap = isMobileDevice() ? gap * 1 : gap;
    
    let offsetX = (window.innerWidth - 8 * (currentWidth + currentGap)) / 2;
    
    images.forEach((link, i) => {
      const x = offsetX + i * (currentWidth + currentGap);
      positions[i] = x;
      gsap.set(link, {
        x: x,
        y: isMobileDevice() ? -currentHeight * 0.1 : -currentHeight / 2,
        width: currentWidth,
        height: currentHeight
      });
    });
  }

  // 页面加载时初始化位置
  initializeSliderPositions();

  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    // 检查设备类型并更新视图
    checkDeviceAndUpdateView();
    
    // 如果是列表视图，更新位置
    if (view === 'list' && !isMobileDevice()) {
      const positions = getListPositions();
      images.forEach((link, i) => {
        gsap.to(link, {
          x: positions[i].x,
          y: positions[i].y,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    } else if (view === 'slider') {
      // 在slider视图下重新计算位置
      initializeSliderPositions();
    }
  });

  // 初始化每张图片位置，横向排列
  images.forEach((link, i) => {
    const x = i * imgWidth;
    positions[i] = x;
    gsap.set(link, { x });
  });

  // 触摸事件相关变量
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startPositions = [];

  // 处理滚轮事件
  window.addEventListener("wheel", (e) => {
    if (view == "slider" && !isAboutVisible) {
      e.preventDefault();
      scrollX = e.deltaY > 0 ? speed : -speed;
      updateSliderPositions(scrollX);
    }
  }, { passive: false });

  // 处理触摸开始事件
  window.addEventListener("touchstart", (e) => {
    if (view == "slider" && !isAboutVisible) {
      touchStartX = e.touches[0].clientX;
      isDragging = true;
      startPositions = [...positions];
    }
  }, { passive: true });

  // 处理触摸移动事件
  window.addEventListener("touchmove", (e) => {
    if (view == "slider" && isDragging && !isAboutVisible) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX;
      const moveSpeed = deltaX * 2; // 调整滑动灵敏度
      
      images.forEach((link, i) => {
        positions[i] = startPositions[i] + moveSpeed;
        gsap.set(link, {
          x: positions[i],
          // duration: 0.3,
          // ease: "power2.out"
        });
      });
    }
    updateSliderPositions(0);
  }, { passive: true });

  // 处理触摸结束事件
  // window.addEventListener("touchend", (e) => {
  //   if (view == "slider") {
  //     isDragging = false;
  //     touchEndX = e.changedTouches[0].clientX;
  //     const deltaX = touchEndX - touchStartX;
      
  //     // 计算滑动速度和方向
  //     const swipeSpeed = Math.abs(deltaX) > 50 ? (deltaX > 0 ? -speed * 2 : speed * 2) : 0;
  //     if (swipeSpeed !== 0) {
  //       updateSliderPositions(swipeSpeed);
  //     }
  //   }
  // }, { passive: true });

  // 更新滑块位置的函数
  function updateSliderPositions(scrollAmount) {
    images.forEach((link, i) => {
      positions[i] += scrollAmount;
      if (positions[i] < -1.5 * imgWidth) {
        positions[i] += totalWidth;
        gsap.set(link, { x: positions[i] });
        gsap.killTweensOf(link);
      } else if (positions[i] > totalWidth - 1.5 * imgWidth) {
        positions[i] -= totalWidth;
        gsap.set(link, { x: positions[i] });
        gsap.killTweensOf(link);
      } else {
        gsap.set(link, {
          x: positions[i],
          // duration: 0.8,
          // ease: "power2.out"
        });
      }
    });
  }



  const viewButtons = document.querySelectorAll(".view-toggle");
  const galleryTrack = document.querySelector(".gallery-track");
  const listView = document.getElementById('listView');
  const listItems = listView.querySelectorAll('.list-item');
  const listViewButton = document.querySelector('.view-toggle[data-view="list"]');

  // 初始化和窗口大小改变时检查设备类型
  function checkDeviceAndUpdateView() {
    if (isMobileDevice()) {
      // 在移动设备上隐藏list按钮
      listViewButton.style.display = 'none';
      // 如果当前是list视图，切换回slider
      if (view === 'list') {
        view = 'slider';
        setSliderLayout(true);
      }
    } else {
      // 在桌面设备上显示list按钮
      listViewButton.style.display = '';
    }
  }

  // 初始检查
  checkDeviceAndUpdateView();

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // 先移除所有按钮的 active
      viewButtons.forEach(b => b.classList.remove("active"));

      // 给当前点击按钮加上 active
      btn.classList.add("active");

      // 可选：根据 data-view 做切换操作
      view = btn.dataset.view;
      console.log("当前选择视图：", view);
      // const view = btn.dataset.view;

      if (view === "slider") {
        gap = 20
        console.log("切换到 slider");
        setSliderLayout();
      } else if (view === "list") {
        console.log("切换到 list");
        setListLayout();
        // 这里可以加逻辑显示 slider 或 list
      }

      isAutoScrolling = true;
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: 0 },
        ease: "power2.inOut",
        onComplete: () => {
          hasScrolled = false;
          isAutoScrolling = true;
        }
      });

    });
  });


  // 保存 slide 模式下的初始位置
  function getSlidePositions() {
    const mobileScale = isMobileDevice() ? 1 : 1;
    const currentWidth = imgW * mobileScale;
    const currentHeight = imgH * mobileScale;
    const currentGap = isMobileDevice() ? gap * 1 : gap;
    
    let offsetX = (window.innerWidth - 8 * (currentWidth + currentGap)) / 2;
    
    return images.map((_, i) => ({
      x: offsetX + i * (currentWidth + currentGap),
      y: isMobileDevice() ? -currentHeight * 0.1 : -currentHeight / 2
    }));
  }
  // 保存 list 模式下的目标位置
  function getListPositions() {
    // 计算缩放后的图片尺寸
    const scaledWidth = imgW * 0.6;
    const scaledHeight = imgH * 0.6;
    
    // 计算水平居中位置
    const centerX = window.innerWidth / 2 - scaledWidth / 2;
    
    // 计算垂直方向的总高度和偏移
    const totalHeight = images.length * (scaledHeight + gap);
    const offsetY = (window.innerHeight - totalHeight) / 2;
    
    return images.map((_, i) => ({
      x: centerX,
      y: -window.innerHeight / 2 + i * (scaledHeight + gap) + offsetY
    }));
  }

  // === 初始化 slide 模式 ===
  function setSliderLayout(animated = false) {
    const positions = getSlidePositions();
    const duration = animated ? 1 : 0;
    
    // 在移动设备上调整图片尺寸
    const mobileScale = isMobileDevice() ? 1 : 1;
    const currentWidth = imgW * mobileScale;
    const currentHeight = imgH * mobileScale;

    images.forEach((link, i) => {
      gsap.to(link, {
        position: "absolute",
        width: currentWidth,
        height: currentHeight,
        x: positions[i].x,
        y: positions[i].y,
        scale: 1,
        borderRadius: "10px",
        duration: 0.5 + Math.abs(i - 4) / 4,
        ease: "power2.inOut"
      });
    });

    listItems.forEach((item, index) => {
      item.classList.remove('visible');
    });

    listView.classList.remove('active');
    
    // 添加slider模式的悬浮效果
    addSliderHoverEffects();

    // 恢复 big-name 的原始状态
    const bigName = document.querySelector('.big-name');
    gsap.fromTo(bigName, {
      // 获取当前状态作为起始点
      fontSize: gsap.getProperty(bigName, "fontSize"),
      justifyContent: gsap.getProperty(bigName, "justifyContent"),
      alignItems: gsap.getProperty(bigName, "alignItems"),
      padding: gsap.getProperty(bigName, "padding"),
      y: gsap.getProperty(bigName, "y")
    }, {
      fontSize: "10vw",
      justifyContent: "center",  // 恢复为居中对齐
      alignItems: "center",
      padding: ".2em 3em",
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    });
  }

  // === 切换到 list 模式 ===
  function setListLayout(animated = true) {
    const positions = getListPositions();
    const duration = animated ? 1 : 0;

    images.forEach((link, i) => {
      gsap.to(link, {
        position: "absolute",
        width: imgW * 0.6,
        height: imgH * 0.6,
        x: positions[i].x,
        y: positions[i].y,
        borderRadius: "10px",
        duration: 0.2 + Math.abs(i - 4) / 8,
        ease: "power2.inOut"
      });
    });

    listView.classList.add('active');
    listItems.forEach((item, index) => {
      item.classList.add('visible');
    });

    // 添加list-item悬浮事件
    addListHoverEffects();

    // 改变 big-name 的样式（两边对齐、字体变小、垂直居中）
    const bigName = document.querySelector('.big-name');
    gsap.fromTo(bigName, {
      // 获取当前状态作为起始点
      fontSize: gsap.getProperty(bigName, "fontSize"),
      justifyContent: gsap.getProperty(bigName, "justifyContent"),
      alignItems: gsap.getProperty(bigName, "alignItems"),
      padding: gsap.getProperty(bigName, "padding"),
      y: gsap.getProperty(bigName, "y")
    }, {
      fontSize: "4vw",
      justifyContent: "space-between",  // 使用flex的space-between让两个span分别靠两边
      alignItems: "center",  // 改为垂直居中
      padding: "0em 3em",   // 移除顶部内边距
      y: 0,                 // 重置垂直偏移
      duration: 0.8,
      ease: "power2.out"
    });
  }

  // === Slider模式悬浮效果 ===
  function addSliderHoverEffects() {
    // 移除之前的事件监听器（如果存在）
    images.forEach((link, index) => {
      link.removeEventListener('mouseenter', handleSliderHover);
      link.removeEventListener('mouseleave', handleSliderLeave);
    });

    // 添加新的事件监听器
    images.forEach((link, index) => {
      link.addEventListener('mouseenter', () => handleSliderHover(index));
      link.addEventListener('mouseleave', () => handleSliderLeave(index));
    });
  }

  function handleSliderHover(hoveredIndex) {
    if (view !== 'slider') return;
    
    const currentLink = images[hoveredIndex];
    const overlay = currentLink.querySelector('.image-overlay');
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  function handleSliderLeave(hoveredIndex) {
    if (view !== 'slider') return;
    
    const currentLink = images[hoveredIndex];
    const overlay = currentLink.querySelector('.image-overlay');
    
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  // === List模式悬浮效果 ===
  function addListHoverEffects() {
    // 移除之前的事件监听器（如果存在）
    listItems.forEach((item, index) => {
      item.removeEventListener('mouseenter', handleListHover);
      item.removeEventListener('mouseleave', handleListLeave);
      item.removeEventListener('click', handleListClick);
    });

    // 添加新的事件监听器
    listItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => handleListHover(index));
      item.addEventListener('mouseleave', () => handleListLeave(index));
      item.addEventListener('click', () => handleListClick(index));
    });
  }

  function handleListHover(hoveredIndex) {
    if (view !== 'list') return;
    gap = 60;
    
    // 计算缩放后的图片尺寸
    const scaledHeight = imgH * 0.6;
    
    // 计算所有图片的新位置
    const basePositions = getListPositions();
    
    // 计算悬浮时的目标Y位置（垂直居中）
    const targetY = -scaledHeight / 2;
    const offsetY = targetY - basePositions[hoveredIndex].y;

    images.forEach((link, i) => {
      gsap.to(link, {
        y: basePositions[i].y + offsetY,
        scale: i === hoveredIndex ? 1.5 : 1.2,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    // 让对应的图片居中放大
    const centerX = window.innerHeight / 2 - (imgW * 0.6 * 1.1) / 2;
    const centerY = - (imgH * 0.6 * 1.1) / 2;

    // gsap.to(images[hoveredIndex], {
    //   // x: centerX,
    //   // y: centerY,
    //   scale: 2.4,
    //   duration: 0.6,
    //   ease: "power2.out"
    // });

    // 触发同一行所有span的悬浮效果
    const currentItem = listItems[hoveredIndex];
    const spans = currentItem.querySelectorAll('span');
    spans.forEach(span => {
      span.classList.add('hovered');
    });
    console.log("handleListHover");
  }

  function handleListLeave(hoveredIndex) {
    if (view !== 'list') return;
    // gsap.killTweensOf("img"); 
    gap = 20
    // 恢复所有图片到原始位置
    const basePositions = getListPositions();

    // setTimeout(() => {
    images.forEach((link, i) => {
      gsap.to(link, {
        // x: basePositions[i].x,
        // y: basePositions[i].y,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    });
    console.log("handleListLeave");
    // },600);

    // 只对当前离开的那一行添加leaving效果
    const currentItem = listItems[hoveredIndex];
    const spans = currentItem.querySelectorAll('span');
    spans.forEach(span => {
      span.classList.remove('hovered');
      span.classList.add('leaving');

      // 动画完成后清除leaving类
      setTimeout(() => {
        span.classList.remove('leaving');
      }, 300); // 与CSS transition时间一致
    });

    // 清除其他所有行的hovered状态（不添加leaving效果）
    listItems.forEach((item, index) => {
      if (index !== hoveredIndex) {
        const spans = item.querySelectorAll('span');
        spans.forEach(span => {
          span.classList.remove('hovered');
        });
      }
    });
  }

  function handleListClick(clickedIndex) {
    if (view !== 'list') return;
    
    // 跳转到对应的详情页面
    const detailPages = [
      'detail/detail1.html',
      'detail/detail2.html', 
      'detail/detail3.html',
      'detail/detail4.html',
      'detail/detail5.html',
      'detail/detail6.html',
      'detail/detail7.html',
      'detail/detail8.html',
      'detail/detail9.html'
    ];
    
    if (detailPages[clickedIndex]) {
      window.location.href = detailPages[clickedIndex];
    }
  }

  document.querySelector('.big-name').addEventListener('click', () => {
    enablePageScroll(); // 启用页面滚动
    isAutoScrolling = true;
    const headerHeight = 60; // header 的高度
    gsap.to(window, {
      duration: 1.5, 
      scrollTo: {
        y: '#bigName',
        offsetY: headerHeight
      },
      ease: 'power2.inOut', 
      onComplete: () => {
        isAutoScrolling = false;
      }
    });
  });

  // === 移动图片到最左边 ===
  function moveImagesToLeft() {
    const leftMargin = 50; // 距离左边的距离

    images.forEach((link, i) => {
      gsap.to(link, {
        x: - (imgW * 0.6 * 1.1),
        // y: -window.innerHeight / 2 + i * (imgH * 0.6 + gap) + (window.innerHeight - 8 * (imgH * 0.6 + gap)) / 2,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
  // === 移动图片到最左边 ===
  function moveImagesToCenter() {
    images.forEach((link, i) => {
      gsap.to(link, {
        x: window.innerWidth / 2 - (imgW * 0.6 * 1.1) / 2,
        // y: -window.innerHeight / 2 + i * (imgH * 0.6 + gap) + (window.innerHeight - 8 * (imgH * 0.6 + gap)) / 2,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  // 控制页面滚动状态
  let isAboutVisible = false;
  const bodyElement = document.body;
  const aboutSection = document.querySelector('.about');
  const gallerySection = document.querySelector('.gallery');

  function enableSliderScroll() {
    bodyElement.style.overflow = 'hidden';
    aboutSection.style.display = 'none';
    isAboutVisible = false;
  }

  function enablePageScroll() {
    bodyElement.style.overflowY = 'auto';
    bodyElement.style.overflowX = 'hidden';
    aboutSection.style.display = 'flex';
    isAboutVisible = true;
  }

  // 初始化时启用滑块滚动
  enableSliderScroll();

  // 监听页面滚动
  window.addEventListener('scroll', () => {
    if (isAboutVisible && window.scrollY === 0) {
      // 如果页面在顶部且 About 页面可见，则启用滑块滚动
      enableSliderScroll();
    }
  });

  // --- Smooth scroll to About ---
  document.querySelector('.about-btn').addEventListener('click', () => {
    // 如果在list模式下，先移动图片到最左边
    if (view === 'list') {
      moveImagesToLeft();
    }

    enablePageScroll();
    
    isAutoScrolling = true;
    const headerHeight = 60; // header 的高度
    gsap.to(window, {
      duration: 1.5, 
      scrollTo: {
        y: '#bigName',
        offsetY: headerHeight
      },
      ease: 'power2.inOut', 
      onComplete: () => {
        isAutoScrolling = false;
      }
    });
  });


  // 点击回到顶部后允许再次触发
  const homeBtn = document.querySelector("#home-btn");
  homeBtn.addEventListener("click", () => {
    isAutoScrolling = true;
    // 先启用滑块滚动，这样动画完成前就可以滑动了
    enableSliderScroll();
    
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: 0 },
      ease: "power2.inOut",
      onComplete: () => {
        hasScrolled = false;
        isAutoScrolling = false; // 修正：应该是 false
      }
    });

    if (view === 'list') {
      moveImagesToCenter();
    }
  });



});






