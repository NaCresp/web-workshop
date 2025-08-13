document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    const musicList = document.getElementById('music-chart-list');
    const audioPlayer = document.getElementById('audio-player');
    const currentSongDisplay = document.getElementById('current-song');
    const apiUrl = 'https://api.vvhan.com/api/wyMusic/热歌榜?type=json';

    async function fetchMusicChart() {
        musicList.innerHTML = '<li>正在加载音乐...</li>';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`网络响应错误: ${response.status}`);
            }
            const data = await response.json();

            console.log('API 返回的原始数据:', JSON.stringify(data, null, 2));

            if (data && data.success && typeof data.info === 'object') {

                const song = data.info;

                musicList.innerHTML = '';

                const listItem = document.createElement('li');
                listItem.textContent = `${song.name} - ${song.auther}`;

                listItem.dataset.musicUrl = song.url;
                listItem.dataset.songName = `${song.name} - ${song.auther}`;
                listItem.style.cursor = 'pointer';

                listItem.addEventListener('click', (e) => {
                    const musicUrl = e.currentTarget.dataset.musicUrl;
                    if (musicUrl && musicUrl !== 'undefined') {
                        playSong(musicUrl, e.currentTarget.dataset.songName);
                    } else {
                        alert('抱歉，这首歌暂时无法播放。');
                    }
                });

                musicList.appendChild(listItem);

                const chartTitle = document.querySelector('#music-chart-list').previousElementSibling;
                if(chartTitle) {
                    chartTitle.textContent = `每日推荐歌曲`;
                }

            }

        } catch (error) {
            console.error('获取音乐失败:', error);
            const errorMessage = error.message.includes('Failed to fetch') ? '网络连接失败' : error.message;
            musicList.innerHTML = `
                <li>加载音乐失败: ${errorMessage}</li>
                <li id="retry-btn" style="color: #3498db; cursor: pointer; list-style-type: none; margin-top: 10px;">点击重试</li>
            `;
            document.getElementById('retry-btn').addEventListener('click', fetchMusicChart);
        }
    }

    function playSong(url, name) {
        if (url) {
            audioPlayer.src = url;
            audioPlayer.play();
            currentSongDisplay.textContent = `正在播放: ${name}`;
        } else {
            console.error('无效的歌曲链接');
            currentSongDisplay.textContent = '播放失败，歌曲链接无效';
        }
    }

    fetchMusicChart();
});
