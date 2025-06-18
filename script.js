// script.js の一番上などに追加
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}


// --- 要素の取得 ---
// HTML要素をJavaScriptで操作するために、それぞれの要素を取得します。
const timerDisplay = document.getElementById('display');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const preset15Button = document.getElementById('preset15');
const preset45Button = document.getElementById('preset45');
const preset90Button = document.getElementById('preset90');

// --- 変数の定義 ---
// タイマーの状態を管理するための変数です。
let timeLeft = 0; // 残り時間（秒単位）
let timerId = null; // setIntervalのIDを保持（タイマーを停止するために必要）
let isRunning = false; // タイマーが現在動いているかどうかのフラグ

// --- 関数: 時間をMM:SS形式で表示する ---
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); // 分を計算
    const remainingSeconds = seconds % 60; // 残り秒数を計算
    // 常に2桁表示にする（例: 5秒 -> 05秒）
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// --- 関数: タイマーを更新する ---
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft); // 表示を更新
}

// --- 関数: タイマーを開始する ---
function startTimer() {
    if (isRunning || timeLeft <= 0) { // すでに実行中か、残り時間がない場合は何もしない
        return;
    }
    isRunning = true; // 実行中に設定
    startButton.disabled = true; // スタートボタンを無効化
    stopButton.disabled = false; // ストップボタンを有効化

    timerId = setInterval(() => { // 1秒ごとに実行される処理
        timeLeft--; // 残り時間を1秒減らす
        updateTimerDisplay(); // 表示を更新

        if (timeLeft <= 0) { // 時間が0になったら
            stopTimer(); // タイマーを停止
            alert('時間になりました！'); // アラートを表示
            timeLeft = 0; // 念のため0に設定
            updateTimerDisplay(); // 最終表示を更新
        }
    }, 1000); // 1000ミリ秒 = 1秒ごとに実行
}

// --- 関数: タイマーを停止する ---
function stopTimer() {
    clearInterval(timerId); // setIntervalを停止
    isRunning = false; // 実行中でないに設定
    startButton.disabled = false; // スタートボタンを有効化
    stopButton.disabled = true; // ストップボタンを無効化
}

// --- 関数: タイマーをリセットする ---
function resetTimer() {
    stopTimer(); // まずタイマーを停止
    timeLeft = 0; // 残り時間を0にリセット
    updateTimerDisplay(); // 表示を更新
    startButton.disabled = false; // スタートボタンを有効化
    stopButton.disabled = true; // ストップボタンを無効化
}

// --- 関数: プリセット時間を設定する ---
function setPresetTime(seconds) {
    stopTimer(); // 現在のタイマーを停止
    timeLeft = seconds; // 指定された秒数を残り時間に設定
    updateTimerDisplay(); // 表示を更新
    startButton.disabled = false; // スタートボタンを有効化
    stopButton.disabled = true; // ストップボタンを無効化
}

// --- イベントリスナーの設定 ---
// 各ボタンがクリックされたときに、対応する関数が実行されるように設定します。
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

preset15Button.addEventListener('click', () => setPresetTime(900)); // 15分 (900秒)
preset45Button.addEventListener('click', () => setPresetTime(2700)); // 45分 (2700秒)
preset90Button.addEventListener('click', () => setPresetTime(5400)); // 90分 (5400秒)

// --- 初期表示 ---
// ページ読み込み時にタイマー表示を初期化します。
updateTimerDisplay();
stopButton.disabled = true; // 最初にストップボタンは無効にしておく