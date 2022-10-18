//滑屏导航
(function(){
	const nav_scroll=document.querySelector('.nav .nav_scroll');
	swiper({
		wrap:nav_scroll,
		dir:'x',
		backOut:'none',
		scrollBar:false,
	});
})();

//折叠导航
(function(){
	const more=document.querySelector('.nav_scroll .more'),
		nav_content=document.querySelector('.nav .nav_content');
	
	let shrink=true;    //是否折叠了

	more.addEventListener('touchend',()=>{
		let child=more.children[0],
			rotateValue=shrink?180:0,   //小三角旋转的角度
			heightValue=shrink?280:0;   //内容区域的高度

		css(child,{rotate:rotateValue});
		tweenMove({
			el:nav_content,
			type:'linear',
			to:{
				height:heightValue
			},
			time:200,
			callBack(){
				shrink=!shrink;
			}
		});
	});
})();

//轮播图
(function(){
	const banner=document.querySelector('.banner'),
		banner_wrap=document.querySelector('.banner_wrap'),
		banner_circles=document.querySelectorAll('.banner_circle span'),
		imgWidth=banner.offsetWidth;
	let startPoint={},
		distance={},
		cn=0,
		ln=0,
		timer;
	
	banner_wrap.innerHTML+=banner_wrap.innerHTML;

	swiper({
		wrap:banner,
		dir:'x',
		scrollBar:false,
		backOut:'none',
		start(ev){
			//用户按下的时候就不要让它自动播放了
			clearInterval(timer);

			startPoint={
				x:ev.changedTouches[0].pageX,
				y:ev.changedTouches[0].pageY,
			}

			if(cn==0){
				cn=banner_wrap.children.length/2;
			}
			if(cn==banner_wrap.children.length-1){
				cn=banner_wrap.children.length/2-1;
			}	

			css(banner_wrap,{translateX:-cn*imgWidth});
		},
		end(ev){
			//轮播图抬起的时候是不需要缓冲的
			cancelAnimationFrame(banner_wrap.timer);	//取消缓冲

			distance={
				x:ev.changedTouches[0].pageX-startPoint.x,
				y:ev.changedTouches[0].pageY-startPoint.y,
			}

			let backWidth=imgWidth/8;
			if(Math.abs(distance.x)>backWidth){
				cn-=distance.x/Math.abs(distance.x);
			}

			tweenMove({
				el:banner_wrap,
				type:'linear',
				to:{
					translateX:-cn*imgWidth
				},
				time:200
			});

			//手指抬起的时候需要让自动播放继续
			autoPlay();

			banner_circles[ln].className='';
			banner_circles[cn%(banner_wrap.children.length/2)].className='active';
			ln=cn%(banner_wrap.children.length/2);
		}
	});
	// 自动播放
	const picMove=()=>{
		cn++;
		tweenMove({
			el:banner_wrap,
			type:'linear',
			to:{
				translateX:-cn*imgWidth
			},
			time:200,
			callBack(){
				if(cn>=banner_wrap.children.length-1){
					cn=banner_wrap.children.length/2-1;
					css(banner_wrap,{translateX:-cn*imgWidth});
				}
			}
		});
		// 修改小圆点
		banner_circles[ln].className='';
		banner_circles[cn%(banner_wrap.children.length/2)].className='active';
		ln=cn%(banner_wrap.children.length/2);
	}

	function autoPlay(){
		clearInterval(timer);
		timer=setInterval(()=>{
			picMove();
		},3000);
	}

	autoPlay();
})();


//整个页面的滑动
(function(){
	const wrap=document.querySelector('.wrap'),
		header=document.querySelector('.scroll .header'),
		nav=document.querySelector('.scroll .nav'),
		navTop=nav.getBoundingClientRect().top,  //导航吸附效果
		refresh=document.querySelector('.scroll .refresh'),	//刷新内容的dom
		updateTip=document.querySelector('.articelWrap .updateTip');

	let isRefresh=false;	//是否要刷新内容

	swiper({
		wrap:wrap,
		move(){ //在页面移动时
			const scrollY=css(wrap.children[0],'translateY');  //页面滚动的距离
			console.log(scrollY.toFixed(2));
			if(scrollY<-navTop){
				//这个条件成立的时候说明现在用户拖动的距离已经把导航拖出去了
				css(header,{translateY:-(scrollY+navTop)});
			}else{
				css(header,{translateY:0});
			}
			//往下拉的时候始终让头部定在上面
			if(scrollY>0){
				css(header,{translateY:-scrollY})
			}
			//在手指滑动的时候需要去改变刷新内容的文字
			if(scrollY>80){
				refresh.innerHTML='松开更新内容';
				isRefresh=true;
			}else{
				refresh.innerHTML='下拉更新内容';
				isRefresh=false;
			}
		},
		toTop(){  //到顶部手指抬起时 
			if(isRefresh){   //只是做更新数据的事，根据变量判断是否更新数据
				//这个条件满足了说明可以刷新数据
				console.log('更新数据');
				css(updateTip, {opacity: 1})
				setTimeout(()=> {
					css(updateTip,{opacity:0})
				},1500)
			}
		},
		toEnd(){
			console.log('触底，加载数据');
		}
	});

})();








