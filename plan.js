const plan = [
{phase:"积累",days:{
"周一":{main:[["Back Squat","82.5 kg × 5组 × 4次"],["Front Squat","70 kg × 4组 × 3次"]],assist:[["Heavy Walkout / 预蹲","1–2组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"65–70% × 5组 × 2次",cj:"65–70% × 4组 × 1–2次"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"75–80% × 4–5个 single",cj:"75–80% × 4个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","77.5 kg × 4组 × 4次"],["Paused Back Squat","72.5 kg × 5组 × 3次，底部停2秒"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"积累",days:{
"周一":{main:[["Back Squat","85 kg × 5组 × 4次"],["Front Squat","72.5 kg × 3组 × 4次"]],assist:[["Heavy Walkout / 预蹲","1–2组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"68–72% × 5组 × 2次",cj:"68–72% × 4组 × 1–2次"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"80–83% × 4个 single",cj:"80–83% × 4个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","82.5 kg × 5组 × 3次"],["Paused Back Squat","75 kg × 3组 × 5次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"积累",days:{
"周一":{main:[["Back Squat","87.5 kg × 5组 × 4次"],["Front Squat","75 kg × 3组 × 4次"]],assist:[["Heavy Walkout / 预蹲","1–2组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"70–75% × 5组 × 2次",cj:"70–75% × 4组 × 1–2次"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"82–85% × 4个 single",cj:"82–85% × 4个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","85 kg × 5组 × 3次"],["Paused Back Squat","77.5 kg × 3组 × 5次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"Deload",days:{
"周一":{main:[["Back Squat","77.5 kg × 3组 × 3次"],["Front Squat","65 kg × 2组 × 3次"]],assist:[["Heavy Walkout / 预蹲","可省略"],["Back Extension / 山羊挺身","2组轻量"]]},
"周二":{choiceMain:{sn:"60–65% × 4组 × 2次",cj:"60–65% × 3–4个 single"},choicePull:"2组轻量",assist:[["Barbell Row / 杠铃划船","2组轻量"]]},
"周四":{choiceMain:{sn:"65–70% × 3个 single",cj:"65–70% × 3个 single"},choicePull:"2组轻量",assist:[["Dips / 双杠臂屈伸","2组轻量"]]},
"周五":{main:[["Front Squat","72.5 kg × 3组 × 3次"],["Paused Back Squat","67.5 kg × 2组 × 4次"]],assist:[["Pull-up / 引体向上","2组轻量"],["Rear Delt Fly / 飞鸟","2组轻量"]]}}},
{phase:"力量",days:{
"周一":{main:[["Back Squat","90 kg × 5组 × 3次"],["Front Squat","77.5 kg × 3组 × 3次"]],assist:[["Heavy Walkout / 预蹲","1–2组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"72–75% × 5组 × 2次",cj:"72–75% × 4个 single"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"85% × 3–4个 single",cj:"85% × 3个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","85 kg × 4组 × 3次"],["Paused Back Squat","80 kg × 3组 × 4次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"力量",days:{
"周一":{main:[["Back Squat","92.5 kg × 5组 × 3次"],["Front Squat","80 kg × 3组 × 3次"]],assist:[["Heavy Walkout / 预蹲","1–2组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"75–78% × 4组 × 2次",cj:"75–80% × 4个 single"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"87–88% × 3个 single",cj:"87–88% × 3个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","87.5 kg × 4组 × 3次"],["Paused Back Squat","82.5 kg × 3组 × 4次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"力量",days:{
"周一":{main:[["Back Squat Heavy Single","100–102.5 kg × 1，RPE 8–8.5"],["Back Squat Back-off","92.5–95 kg × 3组 × 3次"],["Front Squat","80 kg × 3组 × 3次"]],assist:[["Heavy Walkout / 预蹲","1组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"78–82% × 4组 × 1–2次",cj:"78–82% × 4个 single"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"88–90% × 2–3个 single",cj:"88–90% × 2–3个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","90 kg × 4组 × 2次"],["Paused Back Squat","85 kg × 3组 × 4次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"Deload",days:{
"周一":{main:[["Back Squat","80 kg × 3组 × 3次"],["Front Squat","67.5 kg × 2组 × 3次"]],assist:[["Heavy Walkout / 预蹲","可省略"],["Back Extension / 山羊挺身","2组轻量"]]},
"周二":{choiceMain:{sn:"60–70% × 3–4组 × 1–2次",cj:"60–70% × 3个 single"},choicePull:"2组轻量",assist:[["Barbell Row / 杠铃划船","2组轻量"]]},
"周四":{choiceMain:{sn:"65–70% × 3个 single",cj:"65–70% × 3个 single"},choicePull:"2组轻量",assist:[["Dips / 双杠臂屈伸","2组轻量"]]},
"周五":{main:[["Front Squat","75 kg × 3组 × 3次"],["Paused Back Squat","70 kg × 2组 × 4次"]],assist:[["Pull-up / 引体向上","2组轻量"],["Rear Delt Fly / 飞鸟","2组轻量"]]}}},
{phase:"强化",days:{
"周一":{main:[["Back Squat Heavy Single","105 kg × 1"],["Back Squat Back-off","95 kg × 3组 × 2次"],["Front Squat","82.5 kg × 3组 × 2次"]],assist:[["Heavy Walkout / 预蹲","1组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"75–80% × 4个 single",cj:"75–80% × 4个 single"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"90–92% × 2–3个重 single",cj:"90–92% × 2–3个重 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","90 kg × 3组 × 2次"],["Paused Back Squat","82.5 kg × 3组 × 3次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"强化",days:{
"周一":{main:[["Back Squat Heavy Single","107.5 kg × 1，RPE ≤9"],["Back Squat Back-off","97.5 kg × 3组 × 2次"],["Front Squat","85 kg × 3组 × 2次"]],assist:[["Heavy Walkout / 预蹲","1组，重重量支撑"],["Back Extension / 山羊挺身","3组"]]},
"周二":{choiceMain:{sn:"75–80% × 3–4个 single",cj:"75–80% × 3–4个 single"},choicePull:"3组",assist:[["Barbell Row / 杠铃划船","3组"]]},
"周四":{choiceMain:{sn:"92–94% × 1–2个 single",cj:"92–94% × 1–2个 single"},choicePull:"3组",assist:[["Dips / 双杠臂屈伸","3组"]]},
"周五":{main:[["Front Squat","92.5 kg × 3组 × 2次"],["Paused Back Squat","85 kg × 3组 × 3次"]],assist:[["Pull-up / 引体向上","3组"],["Rear Delt Fly / 飞鸟","3组"]]}}},
{phase:"峰值",days:{
"周一":{main:[["Back Squat Heavy Single","110 kg × 1，RPE ≤9"],["Back Squat Back-off","97.5–100 kg × 2组 × 2次"],["Front Squat","87.5 kg × 2组 × 2次"]],assist:[["Heavy Walkout / 预蹲","可选 1组"],["Back Extension / 山羊挺身","2组"]]},
"周二":{choiceMain:{sn:"70–75% × 3–4个 single",cj:"70–75% × 3个 single"},choicePull:"2–3组",assist:[["Barbell Row / 杠铃划船","2组"]]},
"周四":{choiceMain:{sn:"90–95% × 1–2个高质量重 single",cj:"90–95% × 1–2个高质量重 single"},choicePull:"2组",assist:[["Dips / 双杠臂屈伸","2组"]]},
"周五":{main:[["Front Squat Heavy Single","95 kg × 1"],["Front Squat Back-off","90 kg × 2组 × 2次"],["Paused Back Squat","85 kg × 2组 × 3次"]],assist:[["Pull-up / 引体向上","2组"],["Rear Delt Fly / 飞鸟","2组"]]}}},
{phase:"Test Week",days:{
"周一":{main:[["Back Squat PR Test","60×5 → 80×3 → 90×2 → 100×1 → 107.5×1 → 112.5×1 → 117.5×1 → 120×1（顺的话可122.5）"]],assist:[["Heavy Walkout / 预蹲","不做"],["Back Extension / 山羊挺身","不做"]]},
"周二":{choiceMain:{sn:"60–70% × 3个 single",cj:"60–70% × 2–3个 single"},choicePull:"不做或极轻",assist:[["Barbell Row / 杠铃划船","不做或极轻"]]},
"周四":{choiceMain:{sn:"70% → 80% → 87% → 92% → 95% → PR attempt",cj:"70% → 80% → 87% → 92% → 95% → PR attempt"},choicePull:"不做",assist:[["Dips / 双杠臂屈伸","不做"]]},
"周五":{main:[["Front Squat Recovery","70–75 kg × 2组 × 2次"],["Paused Back Squat","不做"]],assist:[["Pull-up / 引体向上","轻松 1–2组"],["Rear Delt Fly / 飞鸟","轻松 1–2组"]]}}}
]
