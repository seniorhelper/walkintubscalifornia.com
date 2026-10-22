/* California bathroom funding checker. Runs in the browser only; nothing is sent anywhere.
   County and plan data: DHCS "CalAIM Community Supports - Managed Care Plan Elections", updated June 2026.
   1 = plan lists Environmental Accessibility Adaptations (Home Modifications), 0 = not listed, 2 = table unclear. */
(function () {
  'use strict';
  var EAA = {"Alameda":[["Alameda Alliance for Health",2],["Kaiser Permanente",1]],"Alpine":[["Blue Cross Partnership Plan",1],["Mountain Valley Health Plan (Health Plan of San Joaquin)",1]],"Amador":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1],["Kaiser Permanente",1]],"Butte":[["Partnership Health Plan of California",0]],"Calaveras":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1]],"Colusa":[["Partnership Health Plan of California",0]],"Contra Costa":[["Contra Costa Health Plan",1],["Kaiser Permanente",1]],"Del Norte":[["Partnership Health Plan of California",0]],"El Dorado":[["Blue Cross Partnership Plan",1],["Mountain Valley Health Plan (Health Plan of San Joaquin)",1],["Kaiser Permanente",1]],"Fresno":[["Blue Cross Partnership Plan",1],["CalViva Health",1],["Kaiser Permanente",1]],"Glenn":[["Partnership Health Plan of California",0]],"Humboldt":[["Partnership Health Plan of California",0]],"Imperial":[["Community Health Plan of Imperial Valley",1],["Kaiser Permanente",1]],"Inyo":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1]],"Kern":[["Blue Cross Partnership Plan",1],["Kaiser Permanente",1],["Kern Family Health Care",1]],"Kings":[["Blue Cross Partnership Plan",1],["CalViva Health",1],["Kaiser Permanente",1]],"Lake":[["Partnership Health Plan of California",0]],"Lassen":[["Partnership Health Plan of California",0]],"Los Angeles":[["AIDS Healthcare Foundation",1],["Kaiser Permanente",1],["L.A. Care Health Plan",1],["SCAN Health Plan",0],["Health Net Community Solutions",1]],"Madera":[["Blue Cross Partnership Plan",1],["CalViva Health",1],["Kaiser Permanente",1]],"Marin":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Mariposa":[["Central California Alliance for Health",1],["Kaiser Permanente",1]],"Mendocino":[["Partnership Health Plan of California",0]],"Merced":[["Central California Alliance for Health",1]],"Modoc":[["Partnership Health Plan of California",0]],"Mono":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1]],"Monterey":[["Central California Alliance for Health",1]],"Napa":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Nevada":[["Partnership Health Plan of California",0]],"Orange":[["CalOptima",1],["Kaiser Permanente",1]],"Placer":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Plumas":[["Partnership Health Plan of California",0]],"Riverside":[["Inland Empire Health Plan",1],["Kaiser Permanente",1],["Molina Healthcare of California Partner Plan",1]],"Sacramento":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1],["Kaiser Permanente",1],["Molina Healthcare of California Partner Plan",1]],"San Benito":[["Central California Alliance for Health",1]],"San Bernardino":[["Inland Empire Health Plan",1],["Kaiser Permanente",1],["Molina Healthcare of California Partner Plan",1]],"San Diego":[["Blue Shield of California Promise Health Plan",1],["Community Health Group Partnership Plan",1],["Kaiser Permanente",1],["Molina Healthcare of California Partner Plan",1]],"San Francisco":[["Blue Cross Partnership Plan",1],["Kaiser Permanente",1],["San Francisco Health Plan",1]],"San Joaquin":[["Health Net Community Solutions",1],["Health Plan of San Joaquin",1],["Kaiser Permanente",1]],"San Luis Obispo":[["CenCal Health",1]],"San Mateo":[["Health Plan of San Mateo",1],["Kaiser Permanente",1]],"Santa Barbara":[["CenCal Health",1]],"Santa Clara":[["Blue Cross Partnership Plan",1],["Kaiser Permanente",1],["Santa Clara Family Health Plan",1]],"Santa Cruz":[["Central California Alliance for Health",1],["Kaiser Permanente",1]],"Shasta":[["Partnership Health Plan of California",0]],"Sierra":[["Partnership Health Plan of California",0]],"Siskiyou":[["Partnership Health Plan of California",0]],"Solano":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Sonoma":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Stanislaus":[["Health Net Community Solutions",2],["Health Plan of San Joaquin",1],["Kaiser Permanente",1]],"Sutter":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Tehama":[["Partnership Health Plan of California",0]],"Trinity":[["Partnership Health Plan of California",0]],"Tulare":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1],["Kaiser Permanente",1]],"Tuolumne":[["Blue Cross Partnership Plan",1],["Health Net Community Solutions",1]],"Ventura":[["Gold Coast Health Plan",1],["Kaiser Permanente",1]],"Yolo":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]],"Yuba":[["Kaiser Permanente",1],["Partnership Health Plan of California",0]]};
  var form = document.getElementById('fundForm');
  if (!form) return;
  var countySel = document.getElementById('fc-county');
  var planSel = document.getElementById('fc-plan');
  var out = document.getElementById('fundOut');

  Object.keys(EAA).sort().forEach(function (c) {
    var o = document.createElement('option');
    o.value = c;
    o.textContent = c + ' County';
    countySel.appendChild(o);
  });

  function fillPlans() {
    var c = countySel.value;
    planSel.innerHTML = '';
    var first = document.createElement('option');
    first.value = '';
    first.textContent = c ? 'Not sure, or not on Medi-Cal' : 'Choose a county first';
    planSel.appendChild(first);
    if (!c || !EAA[c]) return;
    EAA[c].forEach(function (p, i) {
      var o = document.createElement('option');
      o.value = String(i);
      o.textContent = p[0];
      planSel.appendChild(o);
    });
  }
  countySel.addEventListener('change', fillPlans);
  fillPlans();

  function val(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }
  function card(kind, title, body) {
    var label = kind === 'strong' ? 'Start here' : kind === 'ask' ? 'Worth asking' : 'Unlikely';
    return '<div class="route ' + kind + '"><span class="tag">' + label + '</span><h3>' + title + '</h3>' + body + '</div>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var county = countySel.value;
    var planIdx = planSel.value;
    var plan = county && planIdx !== '' && EAA[county] ? EAA[county][+planIdx] : null;
    var cov = val('cov');           // medical, dual, medicare, none
    var ma = val('ma');             // yes, no, unsure
    var risk = val('risk');         // yes, no, unsure
    var facility = val('facility'); // yes, no
    var vet = val('vet');           // sc, other, no
    var age = val('age');           // yes, no
    var income = val('income');     // yes, no, unsure
    var own = val('own');           // own, rent

    var onMedi = cov === 'medical' || cov === 'dual';
    var onMedicare = cov === 'dual' || cov === 'medicare';
    var strong = [], ask = [], no = [];

    // 1. Medi-Cal Community Supports: Environmental Accessibility Adaptations (Home Modifications)
    if (onMedi) {
      var planLine;
      if (plan && plan[1] === 1) {
        planLine = '<p>DHCS lists <strong>' + esc(plan[0]) + '</strong> in ' + esc(county) + ' County as offering this Community Support (June 2026 table).</p>';
      } else if (plan && plan[1] === 0) {
        planLine = '<p>The June 2026 DHCS table does <strong>not</strong> list ' + esc(plan[0]) + ' in ' + esc(county) + ' County as offering it. Ask anyway, because plans can add services, and ask about the HCBA Waiver below.</p>';
      } else if (plan) {
        planLine = '<p>The DHCS table is unclear for ' + esc(plan[0]) + '. Ask member services directly.</p>';
      } else {
        planLine = '<p>Pick your county and plan above to see whether DHCS lists your plan as offering it.</p>';
      }
      var body = planLine +
        '<p>Lifetime maximum $7,500, for members at risk of nursing-facility care. It needs a doctor&#39;s order, usually a physical or occupational therapy evaluation, and a home visit. DHCS&#39;s own example is a roll-in shower; a walk-in tub is not named, so ask before you sign anything.</p>' +
        (own === 'rent' ? '<p>Because you rent, the owner must give written consent.</p>' : '');
      if (risk === 'yes' && !(plan && plan[1] === 0)) {
        strong.push(card('strong', 'Medi-Cal home modifications (Community Supports)', body));
      } else if (risk === 'no') {
        ask.push(card('ask', 'Medi-Cal home modifications (Community Supports)', body + '<p>You said there is no nursing-home risk right now. This benefit is aimed at people who are, so it may not apply yet.</p>'));
      } else {
        ask.push(card('ask', 'Medi-Cal home modifications (Community Supports)', body));
      }
    } else {
      no.push(card('no', 'Medi-Cal home modifications', '<p>These need Medi-Cal managed care membership. If income or savings have dropped, your county social services office can check Medi-Cal eligibility.</p>'));
    }

    // 2. California Community Transitions
    if (onMedi && facility === 'yes') {
      strong.push(card('strong', 'California Community Transitions (CCT)', '<p>For Medi-Cal members moving home after a long stay in a nursing facility or hospital (DHCS describes 60 consecutive days or more). CCT can help set up the home, including modifications such as grab bars and ramps. Ask the facility social worker for a referral to a CCT lead organization.</p>'));
    }

    // 3. HCBA Waiver
    if (onMedi && risk !== 'no') {
      ask.push(card('ask', 'Home and Community-Based Alternatives (HCBA) Waiver', '<p>For Medi-Cal members who meet a nursing-facility level of care. Environmental accessibility adaptations are one of its services. DHCS has kept a waitlist since July 2023, so apply through your area&#39;s waiver agency early.</p>'));
    }

    // 4. MSSP and IHSS
    if (onMedi && age === 'yes' && risk !== 'no') {
      ask.push(card('ask', 'Multipurpose Senior Services Program (MSSP)', '<p>Care management for older Medi-Cal members who are certifiable for nursing-facility care. CDA lists minor home repair among its services. It is not a remodel fund, but a care manager can coordinate the other routes.</p>'));
    }
    if (onMedi && risk !== 'no') {
      ask.push(card('ask', 'In-Home Supportive Services (IHSS)', '<p>IHSS does not pay for remodeling, but a county social worker can authorize paid in-home help based on what the person cannot safely do alone. Apply through your county IHSS office.</p>'));
    }

    // 5. Area Agency on Aging / Dignity at Home
    if (age === 'yes' && income !== 'no') {
      var aaa = '<p>Call <a href="tel:18005102020">1-800-510-2020</a> to reach your Area Agency on Aging. CDA&#39;s Dignity at Home Fall Prevention Program covers people 60 and older or with a disability, with household income at or below 80% of area median income, who have fallen or are at risk. Expect grab bars and smaller fixes rather than a whole tub.</p>';
      if (income === 'yes') strong.push(card('strong', 'Area Agency on Aging fall prevention help', aaa));
      else ask.push(card('ask', 'Area Agency on Aging fall prevention help', aaa));
    }

    // 6. Medicare
    if (onMedicare) {
      if (ma === 'yes' || ma === 'unsure') {
        ask.push(card('ask', 'Medicare Advantage extra benefits', '<p>Some Medicare Advantage plans offer bathroom safety items or allowances. Call the number on your card and ask about the exact item. Free, unbiased help: HICAP at <a href="tel:18004340222">1-800-434-0222</a>.</p>'));
      } else {
        no.push(card('no', 'Original Medicare', '<p>Original Medicare generally does not pay for walk-in tubs or bathroom remodels. HICAP (<a href="tel:18004340222">1-800-434-0222</a>) can help you compare plans at open enrollment.</p>'));
      }
    }

    // 7. Veterans
    if (vet === 'sc' || vet === 'other') {
      var amt = vet === 'sc' ? '$6,800' : '$2,000';
      strong.push(card('strong', 'VA HISA grant', '<p>Based on the category you chose, the HISA lifetime limit is <strong>' + amt + '</strong>. VA excludes spa, hot tub and whirlpool-type tubs, so a roll-in or walk-in shower is often the cleaner HISA project. Get VA approval before work starts.</p>'));
      ask.push(card('ask', 'County Veterans Service Office and CalVet', '<p>A County Veterans Service Office helps with VA paperwork at no charge. CalVet Home Loan customers can also ask CalVet about home improvement loans; these are loans, not grants.</p>'));
    }

    // 8. Property tax
    if (own === 'own') {
      ask.push(card('ask', 'Property tax: accessibility work excluded from reassessment', '<p>In an owner-occupied home, construction that makes the home more accessible for a severely and permanently disabled resident can be excluded from reassessment. A physician signs the claim (form BOE-63). Ask your county assessor for the form and its timing.</p>'));
    }

    // 9. Federal tax deduction
    ask.push(card('ask', 'Federal medical expense deduction', '<p>If you itemize, part of a medically needed bathroom change may count as a medical expense above 7.5% of adjusted gross income. See our <a href="/paying-for-a-walk-in-tub/">paying for it guide</a> and talk with a tax professional.</p>'));

    out.innerHTML = '<h3>Your California routes, best first</h3>' + strong.join('') + ask.join('') + no.join('') +
      '<p class="hint">This checker gives general information, not an eligibility decision. Every program decides for itself, and most will not pay for work done before they approve it.</p>';
    out.setAttribute('tabindex', '-1');
    out.focus();
  });
})();
