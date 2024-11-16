// 初始化地图
const map = L.map('map').setView([31.29834, 120.58319], 12); // 以苏州为中心
L.tileLayer('https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5fabae517720b06a337eae5a9a98bd36', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 19,
}).addTo(map);

// 添加地名标注图层
L.tileLayer('https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5fabae517720b06a337eae5a9a98bd36', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 19,
}).addTo(map);

// 存储所有打点信息
const points = [];

// 添加一个定位按钮
const locateButton = document.createElement('button');
locateButton.innerText = '定位到我的位置';
locateButton.style.position = 'absolute';
locateButton.style.bottom = '10px';
locateButton.style.left = '10px';
locateButton.style.zIndex = '1000';
locateButton.style.padding = '10px';
locateButton.style.fontSize = '16px';
document.body.appendChild(locateButton);

locateButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 15); // 将地图视角定位到当前用户的位置
            
            // 在当前位置添加一个标记并自动弹出窗口让用户添加点的信息
            const marker = L.marker([lat, lng]).addTo(map);
            showPopupForMarker(marker, lat, lng);
        }, () => {
            alert('定位失败，请检查您的浏览器是否允许定位。');
        });
    } else {
        alert('您的浏览器不支持地理定位功能。');
    }
});

// 地图点击事件，添加点
map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // 在点击位置添加标记并弹出窗口让用户添加点的信息
    const marker = L.marker([lat, lng]).addTo(map);
    showPopupForMarker(marker, lat, lng);
});

// 显示弹出窗口以添加点的信息
function showPopupForMarker(marker, lat, lng) {
    // 创建弹出窗口内容
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    const nameInput = document.createElement('input');
    nameInput.placeholder = '点的名称';
    popupContent.appendChild(nameInput);

    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = '点的描述';
    popupContent.appendChild(descriptionInput);

    const photoInput = document.createElement('input');
    photoInput.type = 'file';
    popupContent.appendChild(photoInput);

    const saveButton = document.createElement('button');
    saveButton.innerText = '保存';
    popupContent.appendChild(saveButton);

    const popup = L.popup()
        .setLatLng([lat, lng])
        .setContent(popupContent);

    marker.bindPopup(popup).openPopup();

    // 保存点的信息
    saveButton.addEventListener('click', () => {
        const name = nameInput.value;
        const description = descriptionInput.value;
        const photo = photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : null;

        points.push({ lat, lng, name, description, photo });
        alert('点保存成功！');
        map.closePopup();
    });
}
