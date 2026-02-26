#!/bin/bash
# Download all external thumbnails locally
DIR="/Users/hesh/Downloads/doodle-game-hub/client/public/thumbnails"
mkdir -p "$DIR"

download() {
  local name="$1"
  local url="$2"
  local ext="$3"
  local outfile="$DIR/$name.$ext"
  if [ -f "$outfile" ]; then
    echo "SKIP (exists): $name.$ext"
    return
  fi
  echo "Downloading: $name.$ext"
  curl -s -L -o "$outfile" "$url"
  # Verify it's a real image
  local ftype
  ftype=$(file -b "$outfile" | head -c 20)
  if echo "$ftype" | grep -qi "image\|PNG\|JPEG\|GIF"; then
    echo "  OK: $ftype"
  else
    echo "  FAILED (not image): $ftype"
    rm -f "$outfile"
  fi
}

# Game: baseball
download "baseball" "https://www.google.com/logos/doodles/2019/fourth-of-july-2019-6225363087654912.2-2xa.gif" "gif"

# Game: doodle-cricket-game
download "doodle-cricket-game" "https://www.google.com/logos/doodles/2017/icc-champions-trophy-2017-begins-5642111205507072.4-2xa.gif" "gif"

# Game: snake
download "snake" "https://www.google.com/logos/fnbx/snake_arcade/cta.png" "png"

# Game: pacman
download "pacman" "https://www.google.com/logos/2010/pacman10-hp.png" "png"

# Game: champion-island-games
download "champion-island-games" "https://www.google.com/logos/doodles/2021/doodle-champion-island-games-begin-6753651837108462.2-2xa.gif" "gif"

# Game: magic-cat-academy
download "magic-cat-academy" "https://www.google.com/logos/doodles/2016/halloween-2016-5643419163557888-hp2x.gif" "gif"

# Game: garden-gnomes
download "garden-gnomes" "https://www.google.com/logos/doodles/2018/celebrating-garden-gnomes-6194737877876736-2xa.gif" "gif"

# Game: minesweeper
download "minesweeper" "https://www.google.com/logos/fnbx/minesweeper/cta.png" "png"

# Game: tic-tac-toe
download "tic-tac-toe" "https://img.gamedistribution.com/3943655f3a1c4e988c21889f21c5ed4e-512x512.jpeg" "jpg"

# Game: halloween
download "halloween" "https://www.google.com/logos/doodles/2018/halloween-2018-5662682295304192.6-2xa.gif" "gif"

# Game: boba-bubble-tea
download "boba-bubble-tea" "https://www.google.com/logos/doodles/2023/celebrating-bubble-tea-6753651837109839.2-2xa.gif" "gif"

# Game: google-cat-game (shares image with magic-cat-academy)
download "google-cat-game" "https://www.google.com/logos/doodles/2016/halloween-2016-5643419163557888-hp2x.gif" "gif"

# Game: no-internet-dinosaur-game-google-chrome-dino
download "chrome-dino" "https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/Social_dino-with-hat.gif" "gif"

# Game: t-rex-run-3d
download "t-rex-run-3d" "https://ext.minijuegosgratis.com/dino3d/media/minidino.gif" "gif"

# Game: google-santa-tracker
download "santa-tracker" "https://santatracker.google.com/images/og.png" "png"

# Game: blob-opera-google-game
download "blob-opera" "https://storage.googleapis.com/gweb-experiments.appspot.com/7855-cut-london1.gif" "gif"

# Game: space-invaders-google
download "space-invaders" "https://lh3.googleusercontent.com/H8hhcUas7f9Pi4aMLTQfSTVk1wwE1d_SPYYGldXn9S8GARJis2ED4EpnIfXzfBhTP8KZM64bFnmgowpU3Ct7b7OznwcRakNOM3mB2KRr=s660" "jpg"

# Game: celebrating-petanque
download "celebrating-petanque" "https://www.google.com/logos/doodles/2022/celebrating-petanque-6753651837109257-2xa.gif" "gif"

# Game: dino-swords
download "dino-swords" "https://dinoswords.gg/images/title.png" "png"

# Game: doodle-scoville
download "doodle-scoville" "https://www.google.com/logos/doodles/2016/wilbur-scovilles-151st-birthday-6275288709201920.3-hp2x.png" "png"

# Game: doodle-valentines-day
download "doodle-valentines-day" "https://www.google.com/logos/doodles/2017/valentines-day-2017-day-1-5635040764493824-hp2x.jpg" "jpg"

# Game: pony-express
download "pony-express" "https://www.google.com/logos/doodles/2015/155th-anniversary-of-the-pony-express-5959391580782592-hp2x.jpg" "jpg"

# Game: doodle-history-of-pizza
download "doodle-history-of-pizza" "https://www.google.com/logos/doodles/2021/celebrating-pizza-6753651837109157-2xa.gif" "gif"

# Game: doodle-kids-coding
download "doodle-kids-coding" "https://www.google.com/logos/doodles/2017/celebrating-50-years-of-kids-coding-5745168905928704-2xa.gif" "gif"

# Game: doodle-valentines-day-2022
download "doodle-valentines-day-2022" "https://www.google.com/logos/doodles/2022/valentines-day-2022-6753651837109186.4-2xa.gif" "gif"

# Game: doodle-ludwig-van-beethovens-245th-year
download "doodle-beethoven" "https://www.google.com/logos/doodles/2015/beethovens-245th-birthday-4687587541254144-hp2x.jpg" "jpg"

# Game: doodle-earth-day-2020
download "doodle-earth-day" "https://www.google.com/logos/doodles/2020/earth-day-2020-6753651837108357.2-2xa.gif" "gif"

# Game: doctor-who-doodle
download "doctor-who" "https://lh3.googleusercontent.com/4pkeK2qvHn8N_qn9Ts8dp9ughqbWKDC30vmOgTdvdOdfrH2LuHJhM4LkkWBSH4VT1Ngq94-f8_6wUEPHLal3l2kIZZ2ODjrxQSm06zLwpg=s660" "jpg"

# Game: birth-of-hip-hop-doodle-game
download "birth-of-hip-hop" "https://www.google.com/logos/doodles/2020/stay-and-play-at-home-with-popular-past-google-doodles-hip-hop-2017-6753651837108774-2xa.gif" "gif"

# Game: doodle-celebrating-loteria
download "doodle-loteria" "https://www.google.com/logos/doodles/2019/celebrating-loteria-6753651837108226.3-2xa.gif" "gif"

# Game: basketball-2012-google-doodle
download "basketball-2012" "https://lh3.googleusercontent.com/H39vSnm9Va10y8fPoxN3xVPwv34cJT8pllL7h8pI6SU16TYR3Lm3zdJALjiH1stwCxjuGLbA_vXllLRGURgP13BGKZNpcZMwuQRvPf1e=s660" "jpg"

# Game: celebrating-lake-xochimilco
download "celebrating-lake-xochimilco" "https://www.google.com/logos/doodles/2023/celebrating-lake-xochimilco-6753651837110104.5-2xa.gif" "gif"

# Game: celebrating-johann-sebastian-bach
download "celebrating-bach" "https://www.google.com/logos/doodles/2019/celebrating-johann-sebastian-bach-5702425880035328.3-2xa.gif" "gif"

# Game: doodle-clara-rockmore
download "doodle-clara-rockmore" "https://www.google.com/logos/doodles/2016/clara-rockmores-105th-birthday-5705876574830592.3-hp2x.jpg" "jpg"

# Game: mothers-day-2013-doodle
download "mothers-day-2013" "https://lh3.googleusercontent.com/wDXccuVUTACkKZnPzFUU7EYuIeAiBDihbM0uXJX_7wljxdH0m1C2Gurr87pC93ZQcOwi3iUHkp64eBV1DiPRRbUL4ip9WppykUMCFHk5oA=s660" "jpg"

# Game: mothers-day-2020-doodle
download "mothers-day-2020" "https://www.google.com/logos/doodles/2020/mothers-day-2020-may-10-6753651837108382.5-2xa.gif" "gif"

# Game: doodle-crossword-puzzle
download "doodle-crossword" "https://lh3.googleusercontent.com/Rr2X9m8HrCIGJrOKG3MOr9pRYERaa4yBLWUTeB6YNgJVlseJSMIbFWDc9nX6O2Y9HeWRf-2qL1gy0TInmKtKfRIBAJVPK4eglImapFb9=s660" "jpg"

# Game: slalom-canoe
download "slalom-canoe" "https://www.google.com/logos/2012/slalom_canoe-2012-hp.jpg" "jpg"

# Game: eiji-tsuburayas-birthday
download "eiji-tsuburaya" "https://www.google.com/logos/doodles/2015/eiji-tsuburayas-114th-birthday-4809204506296320-hp2x.jpg" "jpg"

# Game: doodle-roswells-66th-anniversary
download "doodle-roswell" "https://lh3.googleusercontent.com/0XVkBECr7YxpxkJfdxJSz3rBhEV8_9tMcHciSV737fGhA8D22Hf-IvJze4_4sDdSvh5e-Hb6-Rzl_FDfpHcJuxX3DDMb27PiEx67aU84=s660" "jpg"

# Game: google-maps-snake
download "google-maps-snake" "https://game3.glov3.me/uploads/game/html5/25812/static/img/train/world-full.png" "png"

# Game: celebrating-pani-puri
download "celebrating-pani-puri" "https://www.google.com/logos/doodles/2023/celebrating-pani-puri-6753651837110029.2-2xa.gif" "gif"

# Game: doodle-googles-15th-birthday
download "doodle-google-15th" "https://lh3.googleusercontent.com/uV-G02k08X2Ir7NCiPEgWA-qViwlnfT6PD-YUzEhcHreQLuch1SLuvay_squB0IkrxE67FMZM0TOuPjkGKiKOzfsqExZ8J8yKXOCPsOk=s660" "jpg"

# Game: swing-dancing-and-the-savoy-ballroom
download "swing-dancing" "https://www.google.com/logos/doodles/2021/celebrating-swing-dancing-and-the-savoy-ballroom-6753651837108884.4-2xa.gif" "gif"

# Game: doodle-qixi-festival-chilseok
download "doodle-qixi" "https://www.google.com/logos/doodles/2020/qixi-festival-2020-taiwan-6753651837108511-2x.jpg" "jpg"

# Game: chinese-new-year-snake-game
download "chinese-new-year-snake" "https://lh3.googleusercontent.com/udxvvLOX9xvT6b4aE1bq_U0VJtCYtL1vsKzaz62G4NO2PfaXMaz4ffj0qj3DntKb1VGvXrdJsgEkhPhvSJhHj-2Wg4Kyp5yTGULj9JVcQA=s660" "jpg"

# Game: doodle-celebrating-mbira
download "doodle-mbira" "https://www.google.com/logos/doodles/2020/celebrating-mbira-5807476258635776-2xa.gif" "gif"

# Game: hurdles-2012
download "hurdles-2012" "https://www.google.com/logos/2012/hurdles-2012-hp.jpg" "jpg"

# Game: soccer-2012
download "soccer-2012" "https://lh3.googleusercontent.com/3KPEgX05dz5fSJ1KP1Lo14zp0J3fhAXyAWpSIbbN3YBE1rTFfzwmAXVSu_FXJDz8cB4tcM8C1-lWxfXSux6z6qznrvATh6VBNtPYBjil=s660" "jpg"

# Game: global-candy-cup-2015
download "global-candy-cup" "https://www.google.com/logos/doodles/2015/halloween-global-candy-cup-2015-6263662700396544-hp2x.png" "png"

# Game: magic-cat-academy-2
download "magic-cat-academy-2" "https://www.google.com/logos/doodles/2020/halloween-2020-6753651837108597.5-2xa.gif" "gif"

# Game: magic-cat-academy-3
download "magic-cat-academy-3" "https://www.google.com/logos/doodles/2024/halloween-2024-6753651837110311.2-2xa.gif" "gif"

# Game: rubiks-cube
download "rubiks-cube" "https://lh3.googleusercontent.com/XTYwf8wCTilJiDHkZwPeRmaFkV-c2r8oA3li__HWlynh_xxN9B1M5P3e7QrqOOLV-GhkeBnEdJkTUlpc97Mebj1Ix7EQxq56Lz48fkrI=s660" "jpg"

# Game: oskar-fischinger
download "oskar-fischinger" "https://www.google.com/logos/doodles/2017/oskar-fischingers-117th-birthday-5635181101711360-2xa.gif" "gif"

# Game: celebrating-popcorn
download "celebrating-popcorn" "https://www.google.com/logos/doodles/2024/celebrating-popcorn-6753651837110076.3-2xa.gif" "gif"

# Game: wewa-weaving
download "wewa-weaving" "https://www.google.com/logos/doodles/2021/celebrating-the-late-wewa-6753651837109042.3-2xa.gif" "gif"

# Game: rise-of-the-half-moon
download "rise-of-the-half-moon" "https://www.google.com/logos/doodles/2024/rise-of-the-half-moon-6753651837110583.2-2xa.gif" "gif"

# Game: zamboni
download "zamboni" "https://lh3.googleusercontent.com/CSRUGdpQPhS8DHEmim9Koa95pBnrUiVIBBNKFyCBJRqtraJkjNE08rgAHJMCuHklJ5pzl_sGbF9dgOfYVPph0moVwlu8a10OLHs-NxoN=s660" "jpg"

# Game: komodo-national-park
download "komodo-national-park" "https://lh3.googleusercontent.com/bt6aTQcyEQZFQG-byQEttkBs7UczfV_ppaPxX-h3Aq488ghWcSwBQP5fPEKKeJdyLyiIRcgKsv5jfWNZ5s8DgjvQ-o2-zxK6oY06IPfP=s660" "jpg"

# Game: les-paul-guitar
download "les-paul-guitar" "https://lh3.googleusercontent.com/kkw8nP0kH2U5RPHAlVNhp3EDX1zy8QbMmoWtY8lsME_z1MinLeWLNk2W7O57En8y-JTSP6T0fGizkclcsgqMDaGXpCv0o-EhjVVh7uOgmA=s660" "jpg"

# Game: robert-moog-synthesizer
download "robert-moog" "https://www.google.com/logos/2012/moog12-hp.png" "png"

# Game: alan-turing-machine
download "alan-turing" "https://www.google.com/logos/2012/turing-doodle-static.jpg" "jpg"

# Game: pangolin-love (shares image with doodle-valentines-day)
download "pangolin-love" "https://www.google.com/logos/doodles/2017/valentines-day-2017-day-1-5635040764493824-hp2x.jpg" "jpg"

# Game: quick-draw
download "quick-draw" "https://quickdraw.withgoogle.com/static/shareimg.png" "png"

echo ""
echo "=== DONE ==="
echo "Total files in thumbnails dir:"
ls -1 "$DIR" | wc -l
