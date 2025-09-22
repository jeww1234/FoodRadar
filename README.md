# 1️⃣ 초기 세팅
GitHub에서 리포지토리 생성
팀원 4명을 Collaborator로 초대 → 수락하면 초대 메시지 사라짐
로컬에서 리포지토리 클론 → master 브랜치 기본 셋팅
git init, git add ., git commit -m "init", git push origin master
# 2️⃣ 브랜치 전략
develop 브랜치 생성:
git checkout -b develop git push origin develop
Master 브랜치 보호 설정
풀 리퀘스트(PR) 없이 직접 푸시 금지
리뷰어 승인 후 PR만 머지 가능
# 3️⃣ 작업 흐름 (팀원)
본인 이슈 가져오기 → 새로운 기능 브랜치 생성:
git checkout develop git pull origin develop   # 최신 상태로 업데이트 git checkout -b feature/my-feature
작업 진행 → 커밋/푸시:
git add . git commit -m "Add feature X" git push origin feature/my-feature 본인 브렌치에서 develop로 pr 생성 후 머지
개발 완료 후 PR
develop → master PR 생성 → 리뷰 후 승인 → 머지
# 4️⃣ 테스트 & 배포
스크럼마스터가 develop 브랜치에서 통합 테스트
테스트 통과 시 master로 PR 생성 후 머지 → 배포이렇게 수정하는게 좋겟군
