import{_ as i,c as a,d as e,o as t}from"./app-lYsS21pF.js";const n="/image/IMG-20250108%20113019960-2.5a1%20%E6%B7%BB%E5%8A%A0Giscus%E8%AF%84%E8%AE%BA.png",l="/image/IMG-20250108%20113019991-2.5a1%20%E6%B7%BB%E5%8A%A0Giscus%E8%AF%84%E8%AE%BA.png",h="/image/IMG-20250108%20113020021-2.5a1%20%E6%B7%BB%E5%8A%A0Giscus%E8%AF%84%E8%AE%BA.png",p={};function r(o,s){return t(),a("div",null,s[0]||(s[0]=[e('<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><p><a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer">Giscus</a>是一个基于Github Discussions的评论系统，可以让用户登录github账号以评论。<br> 在Vuepress Themehope主题中，已经提供了Giscus的支持，通过一些配置就可以方便的调用</p><hr><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><h3 id="准备" tabindex="-1"><a class="header-anchor" href="#准备"><span>准备</span></a></h3><ol><li>首先，准备一个公有仓库，并且开启<code>Dicussions</code>功能，用于存放评论</li><li>安装<a href="https://github.com/apps/giscus" target="_blank" rel="noopener noreferrer">Giscus</a>的Github App，使Giscus有访问仓库的权限</li></ol><h3 id="配置-1" tabindex="-1"><a class="header-anchor" href="#配置-1"><span>配置</span></a></h3><ol><li><p>前往<a href="https://giscus.app/zh-CN" target="_blank" rel="noopener noreferrer">Giscus的网站</a>，向下滑动找到 <code>配置</code>，并且选择一个合适的语言<br><img src="'+n+'" alt="IMG-20250108 113019960-2.5a1 添加Giscus评论.png" loading="lazy"></p></li><li><p>找到仓库，填入你刚刚的仓库<br> 例如，你的Github仓库地址是 <code>https://github.com/&lt;your-id&gt;/&lt;name&gt;</code><br> 那么，就这样填写仓库这一栏:<br><code>&lt;your-id&gt;/&lt;name&gt;</code><br><img src="'+l+'" alt="IMG-20250108 113019991-2.5a1 添加Giscus评论.png" loading="lazy"></p><p>等待一段时间，若网站说明识别通过，那么就可以继续了。<br><img src="'+h+`" alt="IMG-20250108 113020021-2.5a1 添加Giscus评论.png" loading="lazy"></p></li><li><p>继续往下，找到Discussion分类，根据提示，选择一个你喜欢的分类</p></li><li><p>找到 <code>启用Giscus</code>， 将其中的一些值复制出来备用</p><ul><li><code>data-repo</code></li><li><code>data-repo-id</code></li><li><code>data-cateory</code></li><li><code>data-cateory-id</code></li></ul></li></ol><h3 id="录入" tabindex="-1"><a class="header-anchor" href="#录入"><span>录入</span></a></h3><p>好了，我们已经有足够的数据了，是时候把它塞给vuepress了<br> 首先，找到你的hopeTheme配置文件中的plugins</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">export</span><span style="--shiki-light:#E45649;--shiki-dark:#C678DD;"> default</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> hopeTheme</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    plugins</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，新建一个 <code>comment</code> 键，选择Giscus作为评论，并且填入刚刚的数据</p><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">export</span><span style="--shiki-light:#E45649;--shiki-dark:#C678DD;"> default</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> hopeTheme</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  plugins</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    comment</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      provider</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;Giscus&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 要用的评论系统 因为是Giscus所以填Giscus</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      repo</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;erduotong/erduotong.github.io&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 刚刚data-repo里面的内容</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      repoId</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;...&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 刚刚data-repo-id里面的内容</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      category</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;Announcements&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 刚刚data-category里面的内容</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      categoryId</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;...&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 刚刚data-category-id里面的内容</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    },</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  },</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重启服务，配置就完成了</p>`,14)]))}const d=i(p,[["render",r]]),k=JSON.parse('{"path":"/42%20%E5%8D%A1%E7%89%87%E7%AC%94%E8%AE%B0/%E4%B8%BB%E5%8D%A1%E7%89%87/2.5a1%20%E6%B7%BB%E5%8A%A0Giscus%E8%AF%84%E8%AE%BA.html","title":"2.5a1 添加Giscus评论","lang":"zh-CN","frontmatter":{"category":["卡片/普通"],"date":"2024-10-18T00:00:00.000Z","isOriginal":true,"tags":["giscus","vuepress/theme-hope"],"title":"2.5a1 添加Giscus评论","description":"简介 Giscus是一个基于Github Discussions的评论系统，可以让用户登录github账号以评论。 在Vuepress Themehope主题中，已经提供了Giscus的支持，通过一些配置就可以方便的调用 配置 准备 首先，准备一个公有仓库，并且开启Dicussions功能，用于存放评论 安装Giscus的Github App，使Gis...","head":[["meta",{"property":"og:url","content":"https://blog.erduotong.com/42%20%E5%8D%A1%E7%89%87%E7%AC%94%E8%AE%B0/%E4%B8%BB%E5%8D%A1%E7%89%87/2.5a1%20%E6%B7%BB%E5%8A%A0Giscus%E8%AF%84%E8%AE%BA.html"}],["meta",{"property":"og:site_name","content":"耳朵同的博客"}],["meta",{"property":"og:title","content":"2.5a1 添加Giscus评论"}],["meta",{"property":"og:description","content":"简介 Giscus是一个基于Github Discussions的评论系统，可以让用户登录github账号以评论。 在Vuepress Themehope主题中，已经提供了Giscus的支持，通过一些配置就可以方便的调用 配置 准备 首先，准备一个公有仓库，并且开启Dicussions功能，用于存放评论 安装Giscus的Github App，使Gis..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://blog.erduotong.com/image/IMG-20250108 113019960-2.5a1 添加Giscus评论.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-04-13T02:16:01.000Z"}],["meta",{"property":"article:tag","content":"giscus"}],["meta",{"property":"article:tag","content":"vuepress/theme-hope"}],["meta",{"property":"article:published_time","content":"2024-10-18T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-04-13T02:16:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"2.5a1 添加Giscus评论\\",\\"image\\":[\\"https://blog.erduotong.com/image/IMG-20250108 113019960-2.5a1 添加Giscus评论.png\\",\\"https://blog.erduotong.com/image/IMG-20250108 113019991-2.5a1 添加Giscus评论.png\\",\\"https://blog.erduotong.com/image/IMG-20250108 113020021-2.5a1 添加Giscus评论.png\\"],\\"datePublished\\":\\"2024-10-18T00:00:00.000Z\\",\\"dateModified\\":\\"2025-04-13T02:16:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"耳朵同\\",\\"url\\":\\"https://blog.erduotong.com\\"}]}"]]},"git":{"createdTime":1744510561000,"updatedTime":1744510561000,"contributors":[{"name":"github-actions[bot]","username":"","email":"github-actions[bot]@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":1.64,"words":493},"filePathRelative":"42 卡片笔记/主卡片/2.5a1 添加Giscus评论.md","localizedDate":"2024年10月18日","excerpt":"<h2>简介</h2>\\n<p><a href=\\"https://giscus.app/zh-CN\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Giscus</a>是一个基于Github Discussions的评论系统，可以让用户登录github账号以评论。<br>\\n在Vuepress Themehope主题中，已经提供了Giscus的支持，通过一些配置就可以方便的调用</p>\\n<hr>\\n<h2>配置</h2>\\n<h3>准备</h3>\\n<ol>\\n<li>首先，准备一个公有仓库，并且开启<code>Dicussions</code>功能，用于存放评论</li>\\n<li>安装<a href=\\"https://github.com/apps/giscus\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Giscus</a>的Github App，使Giscus有访问仓库的权限</li>\\n</ol>","autoDesc":true,"bioChainData":{"outlink":[],"backlink":[],"localMap":{"nodes":[{"id":"42 卡片笔记/主卡片/2.5a1 添加Giscus评论.md","value":{"title":"2.5a1 添加Giscus评论","path":"42 卡片笔记/主卡片/2.5a1 添加Giscus评论.md","outlink":[],"backlink":[]}}],"links":[]}}}');export{d as comp,k as data};
