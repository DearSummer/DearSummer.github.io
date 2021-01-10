/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/archives/2019/03/index.html","924a452b8ac8a89415a29cf7029fa5c8"],["/archives/2019/04/index.html","5c87914e54284ca70b9ac2d15de87cd7"],["/archives/2019/05/index.html","439d92a9b238d0e9081d0a530c72c6d8"],["/archives/2019/10/index.html","732638e7341463ad452a72037ccd4d1e"],["/archives/2019/11/index.html","24198082920c6b2f97081bceecc41b9f"],["/archives/2019/11/page/2/index.html","2de0d25f62309cd1df65cb3d0fc0a4b5"],["/archives/2019/12/index.html","2f384ca82f65fca105556fdde9e8815d"],["/archives/2019/index.html","e2cfedb74ec45ade32dad3c67b2bda0b"],["/archives/2019/page/2/index.html","5d27a0da0894f805aa02504e19414f1c"],["/archives/2019/page/3/index.html","06991666d485a8961cc6a57d747aadcc"],["/archives/2019/page/4/index.html","6463f41cb25d6f063ae81635708b70ed"],["/archives/2019/page/5/index.html","d7afa8fc358d2ffa4562488650e70e82"],["/archives/2020/02/index.html","094c821030ce2bf5a874464a56842805"],["/archives/2020/index.html","7b4ebdb8d3cf1704eaf589f866e41ed0"],["/archives/2021/01/index.html","7ac38e8f7c3ff8cc49dd24cb3b445c18"],["/archives/2021/index.html","1b3b9270ecf20fef1c85e8856475c2e0"],["/archives/index.html","911494b6f5c67c4afa0c5f2082976dc1"],["/archives/page/2/index.html","0e87e9e5d8f218d1610826bb1067cb13"],["/archives/page/3/index.html","3288eed08fe9af7a7072c7385607a648"],["/archives/page/4/index.html","ebc3d409bde916c9418e075e80652ac7"],["/archives/page/5/index.html","ccbb8aabb24664d2e9caf9c6a210fb89"],["/bundle.js","4308e9b033295dbf1913a17b5437edb0"],["/css/main.css","fc0da6ba971b0f88dea5605d80c3d3ca"],["/images/algolia_logo.svg","fd40b88ac5370a5353a50b8175c1f367"],["/images/apple-touch-icon-next.png","fce961f0bd3cd769bf9c605ae6749bc0"],["/images/avatar.gif","2bed513bc5f13733cf9a8a12c4e1a971"],["/images/avatar.jpg","1c44d3dfc238ca8ca5464edd14afaa51"],["/images/avatar.png","ea51057c5d0d1a61dafac1e9a595e693"],["/images/cc-by-nc-nd.svg","1c681acc4a150e7236254c464bb5a797"],["/images/cc-by-nc-sa.svg","12b4b29e8453be5b7828b524d3feabce"],["/images/cc-by-nc.svg","dd9cfe99ed839a4a548114f988d653f4"],["/images/cc-by-nd.svg","2d80546af20128215dc1e23ef42d06c2"],["/images/cc-by-sa.svg","c696b3db81cbbfba32f66c1dc88b909a"],["/images/cc-by.svg","6c4f8422b3725cb9f26b6c00e95fc88b"],["/images/cc-zero.svg","79deee77a07fcb79ff680ac0125eacb9"],["/images/favicon-16x16-next.png","b8975923a585dbaa8519a6068e364947"],["/images/favicon-32x32-next.png","5a029563fe3214c96f68b46556670ea1"],["/images/header-bk.jpg","dc7e06b27bfa3d1576abf40d0e321fa4"],["/images/loading.gif","c2196de8ba412c60c22ab491af7b1409"],["/images/logo.svg","ddad9027e42111ccd5b466bc18188970"],["/images/placeholder.gif","c2196de8ba412c60c22ab491af7b1409"],["/images/quote-l.svg","1238a4baccd02c6025ec85b58f4282d4"],["/images/quote-r.svg","85787c6fa27965c81f7be70252b43bed"],["/images/searchicon.png","3d6b5c9d6d6c26a2b76a14b8fdf3438a"],["/index.html","2b8ce901f538e536f98e56fe507b77bc"],["/js/src/affix.js","683c19859764baf0d17538897ea1eba2"],["/js/src/algolia-search.js","f5fa392318805997089ceb3a925979ba"],["/js/src/bootstrap.js","8b6864d08134476c1fcb328f5e51dff3"],["/js/src/exturl.js","2b444179b3145e5007b4d371dac07cd3"],["/js/src/hook-duoshuo.js","45997b0c06abff3cd88efd901f614065"],["/js/src/js.cookie.js","6e9eb1f53afb135aedaf90739c867738"],["/js/src/motion.js","a94df9d4c18f632e6dc097bfefb0aad8"],["/js/src/next-boot.js","f439007f5f8f0cc3b2d99e5e77150950"],["/js/src/post-details.js","9a53fef7381270bb8c96a611d52ebc04"],["/js/src/schemes/muse.js","c89944302b0258593e1e6336e5b6c7ed"],["/js/src/schemes/pisces.js","aa788a9a68ff8d352b7b6e3dbb4ace96"],["/js/src/scroll-cookie.js","890406ae3539e4721ef5f314542e5e46"],["/js/src/scrollspy.js","fafdd7ab6af233b701506c733910b7f5"],["/js/src/utils.js","ecade23d7bb77f013893186d56a92059"],["/lib/Han/dist/font/han-space.woff","b09f2dd7d3ad8ad07f3b8495133909d9"],["/lib/Han/dist/font/han.woff","e841c6b547bc06a06f60f4de52bf906e"],["/lib/Han/dist/han.css","cfcc552e7aebaef5e2f34aee030b956b"],["/lib/Han/dist/han.js","575b6c1667c01798730fbd972e959c9c"],["/lib/Han/dist/han.min.css","cab466d758269b437167422c4a16b364"],["/lib/Han/dist/han.min.js","96482c9c2b3c5ea9bf5a40db162c7f34"],["/lib/algolia-instant-search/instantsearch.min.css","029a13b44e6807955106ff3c075a02f9"],["/lib/algolia-instant-search/instantsearch.min.js","0db46eba0c8133693ee839507b1612f2"],["/lib/canvas-nest/canvas-nest.min.js","36e103d2a05bc706bac40f9ab8881eb7"],["/lib/canvas-ribbon/canvas-ribbon.js","3da4eef253db4019ff4d8b6bf829b400"],["/lib/fancybox/source/blank.gif","325472601571f31e1bf00674c368d335"],["/lib/fancybox/source/fancybox_loading.gif","328cc0f6c78211485058d460e80f4fa8"],["/lib/fancybox/source/fancybox_loading@2x.gif","f92938639fa894a0e8ded1c3368abe98"],["/lib/fancybox/source/fancybox_overlay.png","77aeaa52715b898b73c74d68c630330e"],["/lib/fancybox/source/fancybox_sprite.png","783d4031fe50c3d83c960911e1fbc705"],["/lib/fancybox/source/fancybox_sprite@2x.png","ed9970ce22242421e66ff150aa97fe5f"],["/lib/fancybox/source/helpers/fancybox_buttons.png","b448080f8615e664b7788c7003803b59"],["/lib/fancybox/source/helpers/jquery.fancybox-buttons.css","cac75538c2e3ddfadef839feaca8e356"],["/lib/fancybox/source/helpers/jquery.fancybox-buttons.js","f53c246661fb995a3f12e67fa38e0fa0"],["/lib/fancybox/source/helpers/jquery.fancybox-media.js","c017067f48d97ec4a077ccdf056e6a2e"],["/lib/fancybox/source/helpers/jquery.fancybox-thumbs.css","52ddd84a9f42c1d4cd86d518a7f7e8bc"],["/lib/fancybox/source/helpers/jquery.fancybox-thumbs.js","cf1fc1df534eede4cb460c5cbd71aba6"],["/lib/fancybox/source/jquery.fancybox.css","6c55951ce1e3115711f63f99b7501f3a"],["/lib/fancybox/source/jquery.fancybox.js","921e9cb04ad6e2559869ec845c5be39b"],["/lib/fancybox/source/jquery.fancybox.pack.js","cc9e759f24ba773aeef8a131889d3728"],["/lib/fastclick/README.html","b0923ee41112177f102311d9d08c6dd4"],["/lib/fastclick/lib/fastclick.js","6e9d3b0da74f2a4a7042b494cdaa7c2e"],["/lib/fastclick/lib/fastclick.min.js","a0fc6c24d1f3ff9ac281887c92b24acd"],["/lib/font-awesome/css/font-awesome.css","c495654869785bc3df60216616814ad1"],["/lib/font-awesome/css/font-awesome.min.css","269550530cc127b6aa5a35925a7de6ce"],["/lib/font-awesome/fonts/fontawesome-webfont.eot","674f50d287a8c48dc19ba404d20fe713"],["/lib/font-awesome/fonts/fontawesome-webfont.svg","912ec66d7572ff821749319396470bde"],["/lib/font-awesome/fonts/fontawesome-webfont.ttf","b06871f281fee6b241d60582ae9369b9"],["/lib/font-awesome/fonts/fontawesome-webfont.woff","fee66e712a8a08eef5805a46892932ad"],["/lib/jquery/index.js","32015dd42e9582a80a84736f5d9a44d7"],["/lib/jquery_lazyload/CONTRIBUTING.html","2bb91f504aff31896f37ba49a9471870"],["/lib/jquery_lazyload/README.html","9d9505357b111d988a9a73c39d6a048b"],["/lib/jquery_lazyload/jquery.lazyload.js","8b427f9e86864ee3aaf1ae33e6e14263"],["/lib/jquery_lazyload/jquery.scrollstop.js","f163fd8f02361928853668a96f8a1249"],["/lib/pace/pace-theme-barber-shop.min.css","e8dc66cf2d88abc25fbc89b8a0529abb"],["/lib/pace/pace-theme-big-counter.min.css","db2b8fe31e60f19021545277d2f6e05e"],["/lib/pace/pace-theme-bounce.min.css","ad954aa0bace4b213eeb19d6e89a0bda"],["/lib/pace/pace-theme-center-atom.min.css","8f6bc803acefc6f93afc98fb38201456"],["/lib/pace/pace-theme-center-circle.min.css","93c72298781226a80a9c66b27b21a57d"],["/lib/pace/pace-theme-center-radar.min.css","f0099bdd1cd42e9476bd7abc417c0328"],["/lib/pace/pace-theme-center-simple.min.css","eddff4756dbf21dbbff1c543bd894dde"],["/lib/pace/pace-theme-corner-indicator.min.css","776826157cb28ac1ee5e78771292b9ba"],["/lib/pace/pace-theme-fill-left.min.css","965859b39001da08e1e92327fe3d8e12"],["/lib/pace/pace-theme-flash.min.css","aab39b436e1fa0fdc51df06f2d53c38a"],["/lib/pace/pace-theme-loading-bar.min.css","4e05877f1f9efb9c1e7dd75cb78c764f"],["/lib/pace/pace-theme-mac-osx.min.css","29ae030ceaa8158352c5472218375b91"],["/lib/pace/pace-theme-minimal.min.css","f48f04d370993b55a2745e548cc82743"],["/lib/pace/pace.min.js","24d2d5e3e331c4efa3cda1e1851b31a7"],["/lib/three/canvas_lines.min.js","1324174ae6190fbf63b7bf0ad0a8a5bd"],["/lib/three/canvas_sphere.min.js","5c6bc45b137448b5b9df152ccfb2659c"],["/lib/three/three-waves.min.js","41059bd5e5c7aa520b1b411919e5121f"],["/lib/three/three.min.js","3298078bce82bdb1afadf5b1a280915e"],["/lib/ua-parser-js/dist/ua-parser.min.js","a6e833266c4b41fabb9ba94a145322d8"],["/lib/ua-parser-js/dist/ua-parser.pack.js","6b627e4d61a7135952824bb9c1a4a134"],["/lib/velocity/velocity.js","0361fa6dcf4cf4d19c593cdab0937dd0"],["/lib/velocity/velocity.min.js","c1b8d079c7049879838d78e0b389965e"],["/lib/velocity/velocity.ui.js","f55d22cc592c9f8d4ffd3b41a6b90081"],["/lib/velocity/velocity.ui.min.js","444faf512fb24d50a5dec747cbbe39bd"],["/page/2/index.html","8acb2086f5ed2ae9d4a3c23301fcf3d6"],["/page/3/index.html","9d75086ee6d443cb9e915ecbd8bac12a"],["/page/4/index.html","806ca38a5856f0fa83678bc7b03d16a3"],["/page/5/index.html","228f11c3c2c31fb0fb9821334f79fa63"],["/posts/106f3846/index.html","28bd0a46a9abb596d2071d48deff97bd"],["/posts/1205e6ea/index.html","70914f9fc9fe4f3f811183b9fb640b44"],["/posts/12b12cb9/3.jpg","74a48872ff1d32c0b3b1699f1acae4e6"],["/posts/12b12cb9/before_advence_histogram.jpg","93cbb40667806e0b6f8e363f7e9265ae"],["/posts/12b12cb9/index.html","f80ee0ab28b7f88eedfd5a3cc7e1d548"],["/posts/12b12cb9/laplace.jpg","87726f56382e00692af07d0e948e2227"],["/posts/12b12cb9/laplace_step_1.jpg","5c22acf3cde7c9bb9ef87ee807afe38b"],["/posts/13ed8ac0/d.png","cd352601042f8442daac6bd50edfd844"],["/posts/13ed8ac0/index.html","16c0ab73f558dd4cfe9f04382c219394"],["/posts/1987fc9d/index.html","6a555a8f4e5024322502ba07a0159d2c"],["/posts/1a46f86c/index.html","ce10a37473aaa97e4134de4ce944f3bf"],["/posts/1e089afc/index.html","562e736e4e6d239c184b93084d638b49"],["/posts/2c2f601e/index.html","42b2335640ee8c166a92a14e72da4af5"],["/posts/37270847/beef684d6068ff82.jpg","dc2c1a811b1e4175f7e8130713f05313"],["/posts/37270847/index.html","590fcec0d0fad23a9f4247aa096aabb6"],["/posts/41300e37/1.jpg","4dfdf0023590dfda4ad459e9329097a6"],["/posts/41300e37/d.jpg","fccd3e0ba29a87616608f9d3bc109c32"],["/posts/41300e37/index.html","a704cca24548ead947b413aa64512844"],["/posts/49b27d17/2.jpg","4d18246d63a477c3503ecb9758049da8"],["/posts/49b27d17/LOG.jpg","5a70622b616d03df2f12a351ceb85b26"],["/posts/49b27d17/canny.jpg","756e500286be930ee377b580903ccfa6"],["/posts/49b27d17/index.html","89a68c1443232f583b451fa9989302b3"],["/posts/49b27d17/prewitt.jpg","3c5c90bbc1b81f289e197b7ced3e7e7a"],["/posts/49b27d17/sobel.jpg","2a4d52191d99a3b6e501ab6ea36ed165"],["/posts/4a69870f/index.html","6ef8b5bc459d5aadde4210c42681282d"],["/posts/5318243/index.html","f0c3f90c10af328b96ebce7c2fe7e5cd"],["/posts/589b7415/index.html","aa58f8e72ed226468f8a97a60e23e0cd"],["/posts/6693b937/index.html","4d0f9aad4c0533224d0a11e49ecdba61"],["/posts/6e41d843/index.html","344783fd14730d7d6cc95db58b90d498"],["/posts/6fb12389/histogram.jpg","cf5dadb560837edc6a9ac09947fd4447"],["/posts/6fb12389/index.html","3358181074aa3ce2d7523c4144abf884"],["/posts/75ff8234/balance.jpg","564ce39ec3d2ac0991c8146b28c1e8a0"],["/posts/75ff8234/gray.jpg","9584a2e862a404ecf90d5c2d85d57279"],["/posts/75ff8234/index.html","d1180e0e555d769779f699b0eefa7700"],["/posts/8075ab0a/2_18_4_2_chis.png","6156014235905f80b13690d5f71bf9ab"],["/posts/8075ab0a/Full-adder_logic_diagram.svg.png","d8f552bfe039239df68fe1c041de3990"],["/posts/8075ab0a/Half_Adder.png","7cb3811f454863c0033cfc598132b8c8"],["/posts/8075ab0a/bit_ripple_carry_adder.png","50bf479cb6b6ac6a97220ff09588e25d"],["/posts/8075ab0a/e585a8e58aa0e599a8.png","07b14644d04e633885fd900bdd0476f0"],["/posts/8075ab0a/ha.png","f048c4842cbc8f6e7ea08e5a2d80293f"],["/posts/8075ab0a/index.html","5a51f361c6ad3baf015b6a9cdfec76e1"],["/posts/807cefa7/index.html","63ce735f04cab7db4521bb23c0912bd5"],["/posts/80c2e52/cpp.jpg","7a007f570a956b9a192ebffb6708240f"],["/posts/80c2e52/index.html","eb095dba2b714d0e19e2e319892d027a"],["/posts/80fb69f9/index.html","41766df1297233440521f0f3365d96f6"],["/posts/92c0c7ad/index.html","20a4d7255edcc6786503101b72dc9f1c"],["/posts/92c0c7ad/kmp.gif","c11df4f95e291de1fd348893f5129222"],["/posts/93e26237/index.html","4786ab0d4a7133e1c3ffc35ba2f50dca"],["/posts/95fd897/index.html","341563caa1f2289b2cb5d7017b7d97c0"],["/posts/95fd897/subset1.png","51667a3efe0f3ad78d15dcf2e9502b3d"],["/posts/98eb3162/index.html","168ad12ca16eea5aac05fccbe632d76f"],["/posts/a02b6857/index.html","c6adb90836ef637164bb733ba943ad0e"],["/posts/a88ed812/117_sample.png","099321a3abf9e1118186bb2b101338c9"],["/posts/a88ed812/index.html","1e76fbf375ea9d6fa037fdb875de7108"],["/posts/b0a82fc8/index.html","d211cffeff69af9a91ef651abaa62922"],["/posts/b0b083f0/index.html","fabb415f515d856c58ec2020d7054381"],["/posts/b0cb2387/index.html","e09af435ddf637c91332858e7166265c"],["/posts/b151bc1/index.html","4931f87cef356dc664235790822f5e28"],["/posts/b151bc1/property.png","3796d2608644a7c928e12b94c770a7ca"],["/posts/b1deaac3/index.html","ccd75ef3549d14bf53bd4d9ac15c43ed"],["/posts/b1deaac3/matrix.png","8016d9fa75dba8765e9ec288a1af1c33"],["/posts/b2435380/index.html","9fa7fc5a15b02d2e1c6185551180dac5"],["/posts/b446b6c0/index.html","f495ee13a84fcfb95a169fb5967a9f99"],["/posts/b6eeaa30/index.html","8f20e1984558d8eda186a48cb9358cae"],["/posts/b7e22b5b/index.html","91e3de9f0717e7586361378111d70a3e"],["/posts/bb1dff1a/index.html","a669c4af430e8569737693cd51d021c7"],["/posts/cd3e3288/BT_Overview_Intro.png","47fe37f971e907481a2c35fd2d0ac164"],["/posts/cd3e3288/bt.gif","9302fee731d9fb78b63c574948cc1c0a"],["/posts/cd3e3288/index.html","8902e3a329c726263eac017f746e762f"],["/posts/cf79a2fc/index.html","226585790e5f7d17d2888a7d745f40bb"],["/posts/cf79a2fc/shlab_1.png","322a204636c7898a01a4eb3597ebdae6"],["/posts/d2f8d746/SwiftAlgClub_TrieData-trie-1.png","a4d85b9b155f6c21209c4e976432e487"],["/posts/d2f8d746/Trie_example.png","5ef4067ec57dba8cb2da0139a4ae772b"],["/posts/d2f8d746/index.html","13a1ff43372ac94e601f5f1ed5e9bf7b"],["/posts/d2f8d746/r.png","c7ccf15f55165c0ca54ec55bf5360ab6"],["/posts/d658950c/index.html","569df180978dea504dd54b956c4e304e"],["/posts/d658950c/t.png","afc7a1a6ac8f491eb17d0af9b727b9a2"],["/posts/d7efe202/index.html","e70dee4d505316bf5b68c5dd58639b39"],["/posts/dbb7ef5e/index.html","3b0b070e175781d7577368ecd2950636"],["/posts/e3e8096/index.html","27ba78df274bb1e4f4960f5256a631ac"],["/posts/e9f2d7e8/hough.jpg","d680bb9f594ddb7b29c29b25438402cf"],["/posts/e9f2d7e8/index.html","dc101c7636570904766e7f1e1e12e01e"],["/posts/e9f2d7e8/math.png","2c41817e68e57a3762d687bb05fbd0aa"],["/posts/e9f2d7e8/q.jpg","14f5e0c789d95358b5ee83fd62ef477c"],["/posts/f25a7903/6.jpg","9e22425ae76c34b22ede0430087e3b2c"],["/posts/f25a7903/index.html","19689e4af4130fb51af96af3d4f0dbb8"],["/posts/f25a7903/region_grow.jpg","fe8ea07c177e3812657ec2cb91b514ae"],["/posts/f25a7903/region_grow_with_seed.jpg","7ece0b3409e67600d4e37d9391f3b681"],["/posts/f25a7903/seed.jpg","6a156da7150217726703e7cec9278875"],["/posts/f3fe5f17/1.jpg","c2345aa1c4ba599ea05b6fb2feb95689"],["/posts/f3fe5f17/index.html","812074f5a116e7c1876b7325c95a6248"],["/posts/fffcaacd/index.html","77409063ca1952dfa563990f80230722"],["/style.css","afa97879c7ec4ddf3bb4168eadd35c3d"],["/sw-register.js","9baa2058c7f09c9277922407b741c26a"],["/tags/CODE/index.html","a8d1dcfe4a23bee5775837281e7c65e6"],["/tags/Unity/index.html","7882adc5b5a99f930a020c93fbbea1c9"],["/tags/algorithm/index.html","5779c1e7cbdc371fd2315b8832b72b1b"],["/tags/algorithm/page/2/index.html","44227c9fcc3e58ab761f6f3ac0f8e47f"],["/tags/c/index.html","a8311b3d3f70e9c06037a035d978833d"],["/tags/computer-network/index.html","bc945b891ee69b75a3a026e9a249eff4"],["/tags/cpp/index.html","fa4d8ec53c7be3b7dd2d1b676aede7ad"],["/tags/csapp/index.html","7e2e99921f94ca930d47527f48f60f49"],["/tags/game-ai/index.html","1ef08d7340229aa19e68aa86e6e6a4ec"],["/tags/index.html","50ea4b777c701f4327ba350a6d10d5db"],["/tags/leetcode/index.html","874235bda89832cbd25388ee31c14866"],["/tags/leetcode/page/2/index.html","5528a3018412775c0a144a13b4993947"],["/tags/python/index.html","c0458dfbc022077a45002af2b98b09e1"],["/tags/sort/index.html","613003fdc8f883097574bf7ecfce6ecd"],["/tags/sort/page/2/index.html","e98a6673117f3688be533883b4b8ccc9"],["/tags/stl/index.html","267dcbbe3989fbebd3ad095b5c23f050"],["/tags/trie/index.html","142b181fe77f5f692a336c00cc62cfc4"],["/tags/unity/index.html","fc46209454cfca2376e913d1d851639d"],["/tags/图像处理/index.html","6c22b8fc442a93ed24e01c514ddbcb77"],["/tags/线性代数/index.html","5399c8c85ac80749469a138de4b6382f"],["/tags/随笔/index.html","ad191e7a6a97ab65ea85a152660cf297"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
