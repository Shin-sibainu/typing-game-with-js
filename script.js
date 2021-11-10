const RANDOM_SENTENCE_URL_API = "http://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInputElement = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");

/* inputテキスト入力。合っているかどうかの判定 */
typeInputElement.addEventListener("input", () => {
  /* タイプ音をつける */
  typeSound.play();
  typeSound.currentTime = 0;

  /* 文字と文字を比較する */
  /* ディスプレイに表示されてるSpanタグを取得 */
  const sentence = typeDisplayElement.querySelectorAll("span");
  /* 自分で打ち込んだテキストを取得 */
  const arrayValue = typeInputElement.value.split("");
  let correct = true;
  sentence.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
    }
  });

  /* 次の文章へ */
  if (correct) RenderNextSentence();
});

/* ちゃんとthenかawaitで待たないと欲しいデータが入らない。 */
/* 非同期でランダムな文章を取得する */
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then(
      (data) =>
        /* ここでならちゃんと文章情報を取り扱うことができる。 */
        //console.log(data.content);
        data.content
    );
}

/* 次のランダムな文章を取得する */
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  /* ディスプレイに表示 */
  typeDisplayElement.innerText = ""; //最初はsentenceが入ってた。
  /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) */
  sentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    // characterSpan.classList.add("correct");
    characterSpan.innerText = character;
    typeDisplayElement.appendChild(characterSpan);
    /* 確認 */
    console.log(characterSpan);
  });
  /* テキストボックスの中身を消す。 */
  typeInputElement.value = null;

  /* タイマーのリセット */
  StartTimer();
}

let startTime;
let originTime = 30;
/* カウントアップを開始する。 */
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date(); /* 現在の時刻を表示 */
  console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime(); /* １秒ずれて呼び出される */
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
}

function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 1000
  ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}

function TimeUp() {
  console.log("next sentence");
  RenderNextSentence();
}

RenderNextSentence();
