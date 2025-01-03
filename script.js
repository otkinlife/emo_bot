// 获取 canvas 和 div 元素
const canvas = document.getElementById('emoCanvas');
const div = document.getElementById('emoDiv');
const ctx = canvas.getContext('2d');
const accessoryDiv = document.getElementById('accessoryDiv');

// 表情图片目录和帧数
const emotions = {
    angry: { path: 'images/angry/', frames: 20 },
    blink: { path: 'images/blink/', frames: 39 },
    blink2: { path: 'images/blink2/', frames: 19 },
    bootup: { path: 'images/bootup/', frames: 119 },
    bootup3: { path: 'images/bootup3/', frames: 121 },
    dizzy: { path: 'images/dizzy/', frames: 66 },
    excited: { path: 'images/excited/', frames: 23 },
    happy: { path: 'images/happy/', frames: 44 },
    happy2: { path: 'images/happy2/', frames: 19 },
    happy3: { path: 'images/happy3/', frames: 25 },
    neutral: { path: 'images/neutral/', frames: 59 },
    sad: { path: 'images/sad/', frames: 45 },
    sleep: { path: 'images/sleep/', frames: 97 }
};

// 装扮图片路径
const accessories = {
    headphones: 'css',
    hat: 'images/accessories/hat.png'
};

// 当前表情和帧索引
let currentEmotion = 'happy';
let currentFrame = 0;
let animationFrameId;
const frameRate = 100; // 每帧延迟时间（毫秒）

// 加载图片
function loadImages(emotion, callback) {
    const images = [];
    const { path, frames } = emotions[emotion];
    let loaded = 0;

    for (let i = 0; i < frames; i++) {
        const img = new Image();
        img.src = `${path}frame${i}.png`;
        img.onload = () => {
            loaded++;
            if (loaded === frames) {
                callback(images);
            }
        };
        images.push(img);
    }
}

// 绘制机器人面部框
function drawFaceFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 渲染动画
function renderAnimation(images) {
    drawFaceFrame();
    ctx.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
    currentFrame = (currentFrame + 1) % images.length;
    animationFrameId = setTimeout(() => requestAnimationFrame(() => renderAnimation(images)), frameRate);
}

// 更改表情
function changeEmotion(emotion) {
    if (emotions[emotion]) {
        clearTimeout(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除当前画布
        currentEmotion = emotion;
        currentFrame = 0;
        loadImages(emotion, (images) => {
            renderAnimation(images);
        });
    } else {
        console.error('Emotion not found:', emotion);
    }
}

// 更改装扮
function changeAccessory(accessory) {
    if (accessory === 'headphones') {
        accessoryDiv.style.display = 'block';
    } else if (accessory === 'hat') {
        accessoryDiv.style.backgroundImage = `url(${accessories[accessory]})`;
        accessoryDiv.style.backgroundSize = 'contain';
        accessoryDiv.style.backgroundRepeat = 'no-repeat';
    } else {
        accessoryDiv.style.display = 'none'; // 清除装扮
    }
}

// 调整 canvas 尺寸和位置
function adjustCanvasToDiv() {
    const rect = div.getBoundingClientRect();
    const canvasSize = Math.min(rect.width, rect.height) * 0.7; // 缩小画布大小
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
}

// 初始加载
adjustCanvasToDiv();
changeEmotion(currentEmotion);

// 监听窗口大小变化
window.addEventListener('resize', () => {
    adjustCanvasToDiv();
    changeEmotion(currentEmotion); // 重新加载表情以适应新的尺寸
});
