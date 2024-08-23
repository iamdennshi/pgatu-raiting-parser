const url = 'https://pgatu.ru/sys/rating/view_grid';

function run(text, snils) {
  try {
    // Регулярки с использованием lookahead и lookbehind
    const positionTemplate = new RegExp(
      `(?<=<td>)\\d+(?=<\/td>\\s*<td>${snils}<\/td>)`
    );

    const totalTemplate = new RegExp(
      `(?<=<li>Количество мест: <b>)\\d+(?=<\/b><\/li>)`
    );

    // Позиция в рейтинге
    const position = text.match(positionTemplate)[0];
    // Общее количество мест
    const total = text.match(totalTemplate)[0];

    const rowTemplate = /<tr>\s*<td>\d+<\/td>(\s*<td>.*<\/td>){9}\s*<\/tr>/g;
    const snilsTemplate = new RegExp(`(?<=<td>)${snils}(?=<\/td>)`);
    const passedTemplate = /(?<=<td>)\+(?=<\/td>\s*<td>\d+<\/td>)/;
    // Место относительно сданных оригиналов
    let positionAmongPassed = 1;

    for (tr of text.matchAll(rowTemplate)) {
      if (snilsTemplate.test(tr[0])) break;

      if (passedTemplate.test(tr[0])) {
        positionAmongPassed++;
      }
    }

    console.log(`${position}(${positionAmongPassed})/${total}`);
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Снилс ${snils} не найден`);
    } else {
      console.error(error);
    }
  }
}

function testSnils(snils) {
  const regExpTemplate = /\d{3}-\d{3}-\d{3}\s\d{2}/;
  return new RegExp(regExpTemplate).test(snils);
}

function testConcourseId(concourseId) {
  const regExpTemplate = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;
  return new RegExp(regExpTemplate).test(concourseId);
}

(async function () {
  if (!testSnils(process.env.SNILS)) {
    console.error(
      `${process.env.SNILS} - не верный формат SNILS в .env\nПример: 143-795-285 95`
    );
    process.exit(1);
  }

  if (!testConcourseId(process.env.CONCOURSE_ID)) {
    console.error(
      `${process.env.CONCOURSE_ID} - не верный формат CONCOURSE_ID в .env\nПример: 0a70e7f1-a4ee-4356-be13-5f7420eb59f2`
    );
    process.exit(1);
  }

  const snils = process.env.SNILS;
  const concourseId = process.env.CONCOURSE_ID;

  const response = await fetch(url, {
    method: 'POST',
    body: `concourse_id=${concourseId}`,
    headers: {
      // Тип обрабатываемого контента клиентом - любой
      Accept: '*/*',
      // Поддерижваемые клиентом методы сжатия
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      // Поддерижваемые клиентом языки для ответа, по приоритету (Например приоритет 0.9 для en-US)
      'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,ru-RU;q=0.7',
      // Клиент хочет сохранить содеинение открытым, вместо закрытия его после одного запроса
      Connection: 'keep-alive',
      // Длина тела запроса
      'Content-Length': '49',
      // Тип данных в теле запроса
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      // Не отслеживать действия клиента
      DNT: '1',
      // Домен
      Host: 'pgatu.ru',
      // Источник с которого отправялется запрос
      Origin: 'https://pgatu.ru',
      // С какой страницы произошла отправка запроса
      Referer: 'https://pgatu.ru/sys/rating/',
      // Тип запращиваемого ресурса - empty не предназачен для определенного типа ресурса (script, image)
      'Sec-Fetch-Dest': 'empty',
      // Режим безопасности запроса
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      // Инициатор запроса
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      // 0 - десктопное, 1 - мобильное
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    },
  });
  const text = await response.text();

  run(text, snils);
})();
