console.log('スクリプトファイルが読み込まれました！');

const city = {
  nagoya: {
    name: '名古屋',
    lat: 35.1815,
    lon: 136.9066
  },
  tokyo: {
    name: '東京',
    lat: 35.6895,
    lon: 139.6917
  },
  osaka: {
    name: '大阪',
    lat: 34.6937,
    lon: 135.5023
  }
};

function fetchWeather(cityData) {
  const wrapper_element = document.getElementsByClassName('wrapper')[0];
  wrapper_element.innerHTML = '';
  const lat = cityData.lat;
  const lon = cityData.lon;
  console.log(cityData.name, lat, lon);

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=a8ab21026e1651fcef96bee61d6d7756&units=metric`
  )
    .then((response) => response.json()) // JSONテキストをJSオブジェクトに変換
    .then((data) => {
      console.log(data); // ここでデータを確認できる

      function createCard(time, tempMax, tempMin, iconUrl) {
        //class名が wrapper の最初の1つを wrapper_element という変数に入れる
        const wrapper_element = document.getElementsByClassName('wrapper')[0];
        //card
        const card_element = document.createElement('div');
        card_element.className = 'card';

        //card-icon
        const card_icon_element = document.createElement('div');
        //icon
        const icon_element = document.createElement('img');
        icon_element.className = 'icon';
        icon_element.src = `https://openweathermap.org/img/wn/${iconUrl}@2x.png`;
        icon_element.alt = '天気のアイコン';
        icon_element.width = 100; // 横サイズ（px）
        icon_element.height = 100; // 縦サイズ（px）
        card_icon_element.appendChild(icon_element);
        //card-iconを( <div> card )に追加
        card_element.appendChild(card_icon_element);

        //card-content
        const card_content_element = document.createElement('div');
        card_content_element.className = 'card-content';
        //box-time
        const time_element = document.createElement('div');
        time_element.className = 'box-time';
        time_element.textContent = time;
        card_content_element.appendChild(time_element);

        //box-temp
        const box_temp_element = document.createElement('div');
        box_temp_element.className = 'box-temp';
        //box1
        const box1_element = document.createElement('div');
        box1_element.className = 'box1';
        box1_element.textContent = tempMax;
        box_temp_element.appendChild(box1_element);
        //box2
        const box2_element = document.createElement('div');
        box2_element.className = 'box2';
        box2_element.textContent = '/';
        box_temp_element.appendChild(box2_element);
        //box3
        const box3_element = document.createElement('div');
        box3_element.className = 'box3';
        box3_element.textContent = tempMin;
        box_temp_element.appendChild(box3_element);

        //box-tempをcard-content
        card_content_element.appendChild(box_temp_element);
        //card_content_elementをcard-content
        card_element.appendChild(card_content_element);
        // wrapper_element の下に card_element を入れる
        wrapper_element.appendChild(card_element);
      }

      //必要な部分だけ取り出して扱いやすい形に加工
      const processedList = data.list.map((item) => ({
        date: new Date(item.dt * 1000),
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        weather: item.weather[0].main,
        icon: item.weather[0].icon
      }));
      console.log(processedList);

      //今日の日付（YYYY-MM-DD）を作る
      const today = new Date().toISOString().split('T')[0];
      // → "2025-01-01T09:00..." → "2025-01-01" を取り出す

      //今日に該当するデータだけを抽出
      const matched = processedList.filter((item) => {
        const days = item.date.toISOString().split('T')[0];
        return days === today;
      });
      console.log(matched);

      matched.forEach((item) => {
        const time = item.date.getHours() + ':00';
        createCard(time, Math.round(item.temp_max), Math.round(item.temp_min), item.icon);
      });

      const locationElement = document.getElementById('location');
      locationElement.textContent = `${cityData.name}の天気`;
      const datetimeElement = document.getElementById('datetime');
      const now = new Date();
      const month = now.getMonth() + 1; // 1 (月)
      const date = now.getDate(); // 11 (日)
      const day = now.getDay(); // 4 (曜)
      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
      const dayofweek = dayNames[day]; // 日 (曜)
      const hours = now.getHours(); // 11 (時)
      const minutes = now.getMinutes().toString().padStart(2, '0'); // 30 (分)
      datetimeElement.innerHTML = `<div class="now-dates">${month}月${date}日(${dayofweek})</div>
    ただいま <span class="now-hours">${hours}:${minutes}</span> です`;
    })

    .catch((error) => {
      console.error('データの取得中にエラーが発生しました:', error);
    });
}

//実行
fetchWeather(city.nagoya);
