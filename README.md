# posiheart — 개발자 포트폴리오

한국어 중심의 단일 페이지 포트폴리오입니다. **HTML, CSS, JavaScript**로 작성했으며 프레임워크, 패키지 설치, 빌드가 필요하지 않습니다. GitHub Actions가 파일을 검사한 뒤 GitHub Pages에 자동 배포합니다.

현재 자기소개, 기술 목록, 프로젝트 3개는 **교체용 예시**입니다. 실제 경력이나 성과를 나타내지 않습니다. GitHub 링크는 공개 프로필 `https://github.com/posiheart`를 사용합니다.

## 파일 구성

```text
index.html                    자기소개·기술·프로젝트·연락처의 원본
assets/styles.css             색상·레이아웃·반응형 스타일
assets/script.js              현재 메뉴 표시와 연도 갱신
assets/favicon.svg            파비콘
scripts/serve.mjs              선택 사항: 로컬 미리보기 서버
scripts/check.mjs              선택 사항: 정적 파일 검사
.github/workflows/deploy.yml   GitHub Pages 자동 배포
```

## 로컬에서 보기

`index.html`을 브라우저로 열면 바로 볼 수 있습니다. 외부 폰트나 외부 라이브러리를 불러오지 않아 인터넷 연결 없이도 화면이 표시됩니다. 내용 수정 후 브라우저를 새로고침하세요.

HTTP 주소로 확인하려면 Node.js 24 이상에서 다음 명령을 실행하세요. 이 도구는 개발용이며, GitHub Pages에 배포되는 사이트는 Node.js를 사용하지 않습니다.

```sh
node scripts/serve.mjs
```

표시된 `http://127.0.0.1:4173/` 주소를 엽니다. 종료는 `Ctrl+C`입니다. 포트가 사용 중이면 `node scripts/serve.mjs --port 4174`처럼 바꿀 수 있습니다.

## 내 콘텐츠로 바꾸기

콘텐츠는 모두 **`index.html` 한 파일**에 있습니다. `1. 자기소개`, `2. 기술`, `3. 프로젝트`, `4. 연락처` 주석을 찾아 수정하세요. JavaScript 데이터와 HTML을 따로 맞출 필요가 없습니다.

1. **이름과 소개:** 상단 로고, 큰 이름, 자기소개 문단, 프로필 요약, 하단 이름을 바꿉니다. 표시 이름과 GitHub 계정 주소는 각각 수정하세요.
2. **기술:** 각 `.skill-group`의 제목, 설명, 목록을 본인의 기술로 교체합니다.
3. **프로젝트:** `.project`인 `<article>` 하나가 프로젝트 하나입니다. 제목, 설명, 기술, 해결한 문제, 나의 기여, 결과와 배움을 작성하세요. 추가할 때는 제목 `id`와 `aria-labelledby`를 함께 고유한 값으로 바꾸고 순번을 맞춥니다.
4. **소스·데모 링크:** 첫 프로젝트 안의 주석 처리된 `.project-links`를 참고합니다. 실제 URL을 넣은 링크만 남기고 해당 부분의 주석을 해제하세요. 주소가 없으면 링크 자체를 추가하지 않습니다.
5. **프로젝트 이미지:** 파일을 `assets/images/`에 넣고 첫 프로젝트의 `<img>` 예시를 활용합니다. 실제 경로, 대체 설명, 이미지의 원본 너비·높이를 입력한 뒤 해당 태그만 주석에서 꺼내세요. 이미지가 없어도 빈 공간이나 깨진 이미지가 표시되지 않습니다.
6. **이메일:** 연락처의 주석 처리된 이메일 링크에서 `YOUR_EMAIL` 두 곳을 실제 이메일로 바꾸고 주석을 해제합니다. 이메일 없이 GitHub만 사용할 수도 있습니다.
7. **예시 표시:** 실제 콘텐츠로 교체한 영역의 `example-label`, `aria-label`에 있는 예시 설명, 프로필 요약의 예시 표시를 함께 정리합니다. 모든 예시를 교체한 뒤 상단 안내문과 메타 설명의 예시 문구도 지웁니다.
8. **공유·검색 정보:** `<title>`, `description`, `og:title`, `og:description`을 실제 소개에 맞춥니다. `canonical`과 `og:url`은 실제 게시 주소로 바꿉니다.

색상은 `assets/styles.css` 맨 위의 `:root`에서 수정합니다. 모든 자산은 `./assets/...`와 같은 상대 경로를 사용하세요.

## GitHub Actions 자동 배포

워크플로는 `main` 브랜치에 푸시할 때와 수동 실행할 때 동작합니다. 정적 파일을 검사하고 `index.html`과 `assets/`만 배포합니다. README, 로컬 도구와 검증 자료는 게시하지 않습니다. 별도 토큰을 만들거나 저장할 필요 없이 GitHub의 기본 `GITHUB_TOKEN`을 사용합니다.

### 사용자 사이트: `https://posiheart.github.io/`

1. GitHub에서 **`posiheart.github.io`**라는 빈 공개 저장소를 생성합니다.
2. 프로젝트 파일을 저장소의 `main` 브랜치에 올립니다. Git 명령을 사용하는 경우, 프로젝트 폴더에서 실행합니다. 이미 Git 저장소라면 `git init`과 기존 `origin` 추가는 생략하세요.

   ```sh
   git init
   git add .
   git commit -m "Create static developer portfolio"
   git branch -M main
   git remote add origin https://github.com/posiheart/posiheart.github.io.git
   git push -u origin main
   ```

3. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
4. **Actions → Deploy portfolio to GitHub Pages → Run workflow**에서 `main`을 선택하고 실행합니다. Pages 설정 전에 첫 자동 실행이 실패했다면 이 단계에서 다시 실행하면 됩니다.
5. 배포 작업의 `github-pages` 환경에 표시되는 주소를 엽니다. 이후에는 `main`에 푸시할 때마다 자동 갱신됩니다.

### 프로젝트 사이트: `https://posiheart.github.io/portfolio/`

저장소 이름을 `portfolio`처럼 지정해도 됩니다. 상대 경로를 사용하므로 HTML·CSS·JavaScript의 자산 경로를 다시 설정할 필요가 없습니다. 다음 두 메타데이터만 실제 게시 주소에 맞추세요.

```html
<meta property="og:url" content="https://posiheart.github.io/portfolio/" />
<link rel="canonical" href="https://posiheart.github.io/portfolio/" />
```

Git 원격 주소도 해당 저장소로 바꾸고, 동일하게 Pages의 Source를 GitHub Actions로 설정합니다. 프레임워크의 `site`·`base` 설정 파일은 사용하지 않습니다.

하위 경로를 로컬에서 확인하려면:

```sh
node scripts/serve.mjs --port 4174 --base /portfolio/
```

`http://127.0.0.1:4174/portfolio/`를 엽니다.

배포가 실패하면 **Actions**의 실패한 단계 로그를 확인하세요. `Validate static files` 실패는 잘못된 링크·누락된 이미지 등을 수정하고, Pages 관련 실패는 Source 설정과 저장소의 Actions 권한을 확인합니다. 다른 기본 브랜치를 쓰려면 워크플로의 `branches`와 `if`에 있는 `main`을 함께 변경하세요.

배포 구성은 [GitHub 공식 정적 사이트 워크플로](https://github.com/actions/starter-workflows/blob/main/pages/static.yml)와 [GitHub Pages 사용자 지정 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 참고했습니다.

## 확인하기

Node.js 24 이상에서 다음 검사를 실행할 수 있습니다. 의존성 설치는 필요하지 않습니다.

```sh
node scripts/check.mjs
```

검사는 제목·메타 설명, 제목 계층, 중복 ID, 내부 링크, 로컬 파일, 접근성 라벨, 미완성 선택 링크와 JavaScript 문법을 확인합니다. 브라우저에서는 모바일·태블릿·데스크톱 크기, 키보드 탐색, 메뉴 이동, 동작 감소 설정을 확인하세요. 본문과 링크는 JavaScript 없이도 작동하며, 자바스크립트는 현재 메뉴 표시와 연도 갱신만 담당합니다.
