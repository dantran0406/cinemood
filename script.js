window.addEventListener("DOMContentLoaded", () => {
  // ===== INTRO: EMOJI RAIN =====
  const canvas = document.getElementById("emoji-rain");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const emojis = ["🎬","❤️","😂","😱","😍","🕵️‍♂️","👽","💥","🎉","🍿",
                  "🍫","🍕","🥳","🎭","🎶","🧛‍♂️","🦸‍♀️","🌟","🎤","📽️",
                  "🍔","🍟","🌈","☠️","🛸","🎹","📺","🎥","💡","🧩",
                  "🛎️","🚀","🛶","🏰","🌌","⚡","🔥","🧙‍♂️","🧟‍♂️","🧚‍♀️",
                  "🪄","🕹️","💎","🎯","🏹","🧪","🧸","📀","📖","🖌️"];

  const drops = emojis.concat(emojis).map(e => {
    const size = 24 + Math.random() * 16;
    return {x:Math.random()*canvas.width, y:Math.random()*-canvas.height, emoji:e, size:size, speed:1+size/15+Math.random()};
  });

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drops.forEach(d => {
      ctx.font = `${d.size}px serif`;
      ctx.fillText(d.emoji,d.x,d.y);
      d.y += d.speed;
      if(d.y>canvas.height){ d.y=-50-Math.random()*canvas.height; d.x=Math.random()*canvas.width; d.size=24+Math.random()*16; d.speed=1+d.size/15+Math.random(); }
    });
    requestAnimationFrame(draw);
  }
  draw();

  const logo = document.getElementById("logo");
  setTimeout(()=>{ logo.style.opacity=1; },1500);

  setTimeout(()=>{
    const intro=document.getElementById("intro");
    intro.style.transition="opacity 1.5s ease";
    intro.style.opacity=0;
    setTimeout(()=>{ intro.style.display="none"; document.getElementById("main-content").style.display="block"; },1500);
  },4500);

  // ================== EMOTION COLORS ==================
  const emotionColor = { "Comédie":"#f1c40f", "Romance":"#3498db", "Action":"#9b59b6", "Horrible":"#e74c3c", "Null":"#7f8c8d" };
  let allMovies = [];

  // ================== LOAD DATA ==================
  d3.json("movies.json").then(data => {
    allMovies=data;
    update(allMovies);
    d3.selectAll("#filters input").on("change",applyFilterAndSort);
    d3.select("#sort-select").on("change",applyFilterAndSort);
  });

  // ================== APPLY FILTER + SORT ==================
  function applyFilterAndSort(){
    const activeEmotions=d3.selectAll("#filters input:checked").nodes().map(d=>d.value);
    let filtered = activeEmotions.length? allMovies.filter(d=>activeEmotions.includes(d.emotion)) : allMovies.slice();

    const sortVal=d3.select("#sort-select").property("value");
    if(sortVal==="year-asc") filtered.sort((a,b)=>a.year-b.year);
    else if(sortVal==="year-desc") filtered.sort((a,b)=>b.year-a.year);
    else if(sortVal==="imdb-asc") filtered.sort((a,b)=>a.imdb-b.imdb);
    else if(sortVal==="imdb-desc") filtered.sort((a,b)=>b.imdb-a.imdb);

    update(filtered);
  }

  // ================== UPDATE ALL ==================
  function update(data){
    renderGrid(data);
    drawEmotionChart(data);
    drawBubbleChart(data);
  }

  // ================== GRID POSTER ==================
  function renderGrid(data){
    const grid=d3.select("#movie-grid");
    const cards=grid.selectAll(".movie-card").data(data,d=>d.title);

    cards.exit().transition().duration(500).style("opacity",0).remove();

    const enter=cards.enter().append("div").attr("class","movie-card").style("border-top",d=>`6px solid ${emotionColor[d.emotion]||"#ccc"}`).style("opacity",0);
    enter.append("img").attr("class","poster");
    enter.append("div").attr("class","overlay");

    const merged=enter.merge(cards);

    merged.select("img").attr("src",d=>d.poster).attr("alt",d=>d.title)
          .on("error",function(){ d3.select(this).attr("src","https://via.placeholder.com/300x450?text=No+Poster"); });

    merged.select(".overlay").html(d=>`
      <h3>${d.title}</h3>
      <p>${d.year}</p>
      <p><strong>Émotion :</strong> ${d.emotion}</p>
      <p><strong>IMDb :</strong> ${d.imdb}</p>
      <p>${d.genre}</p>
    `);

    merged.transition().duration(800).style("opacity",1);
  }

  // ================== EMOTION CHART ==================
  function drawEmotionChart(data){
    const counts=d3.rollup(data,v=>v.length,d=>d.emotion);
    const chartData=Array.from(counts,([emotion,value])=>({emotion,value}));
    const svg=d3.select("#emotion-chart"); svg.selectAll("*").remove();
    const width=+svg.attr("width"), height=+svg.attr("height");
    const margin={top:20,right:20,bottom:50,left:50};

    const x=d3.scaleBand().domain(chartData.map(d=>d.emotion)).range([margin.left,width-margin.right]).padding(0.3);
    const y=d3.scaleLinear().domain([0,d3.max(chartData,d=>d.value)]).nice().range([height-margin.bottom,margin.top]);

    svg.append("g").attr("transform",`translate(0,${height-margin.bottom})`).call(d3.axisBottom(x));
    svg.append("g").attr("transform",`translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg.selectAll("rect").data(chartData).enter().append("rect")
      .attr("x",d=>x(d.emotion))
      .attr("y",d=>y(d.value))
      .attr("width",x.bandwidth())
      .attr("height",d=>y(0)-y(d.value))
      .attr("fill",d=>emotionColor[d.emotion]);
  }

  // ================== BUBBLE CHART ==================
  function drawBubbleChart(data){
    const svg=d3.select("#bubble-chart"); svg.selectAll("*").remove();
    const width=+svg.attr("width"), height=+svg.attr("height");
    const margin={top:20,right:20,bottom:40,left:50};

    const x=d3.scaleLinear().domain(d3.extent(data,d=>d.year)).nice().range([margin.left,width-margin.right]);
    const y=d3.scaleLinear().domain([0,10]).range([height-margin.bottom,margin.top]);
    const r=d3.scaleSqrt().domain(d3.extent(data,d=>d.imdb)).range([5,25]);

    svg.append("g").attr("transform",`translate(0,${height-margin.bottom})`).call(d3.axisBottom(x).ticks(8).tickFormat(d3.format("d")));
    svg.append("g").attr("transform",`translate(${margin.left},0)`).call(d3.axisLeft(y));

    const tooltip=d3.select("#tooltip");

    const circles=svg.selectAll("circle").data(data,d=>d.title).join(
      enter=>enter.append("circle")
        .attr("cx",d=>x(d.year))
        .attr("cy",height).attr("r",0)
        .attr("fill",d=>emotionColor[d.emotion]||"#ccc").attr("opacity",0.7)
        .call(enter=>enter.transition().duration(1000).attr("cy",d=>y(d.imdb)).attr("r",d=>r(d.imdb))),
      update=>update.transition().duration(1000).attr("cx",d=>x(d.year)).attr("cy",d=>y(d.imdb)).attr("r",d=>r(d.imdb)),
      exit=>exit.transition().duration(500).attr("r",0).remove()
    );

    circles.on("mousemove",(event,d)=>{
      tooltip.style("opacity",1)
        .style("left",(event.pageX+10)+"px")
        .style("top",(event.pageY-20)+"px")
        .html(`<strong>${d.title}</strong><br>Année: ${d.year}<br>IMDb: ${d.imdb}<br>Émotion: ${d.emotion}`);
    }).on("mouseleave",()=>tooltip.style("opacity",0));
  }
});
