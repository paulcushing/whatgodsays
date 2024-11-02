"use client";

import { useRouter } from "next/navigation";

const data = [
  {
    neutral:
      "I am God's child for I am born again of the incorruptible seed of the Word of God that lives and abides forever.",
    masculine:
      "{name} is God's child for he is born again of the incorruptible seed of the Word of God that lives and abides forever.",
    feminine:
      "{name} is God's child for she is born again of the incorruptible seed of the Word of God that lives and abides forever.",
    verse:
      '<a href="https://www.bible.com/bible/59/1PE.1.23" target="_blank">1 Peter 1:23</a>',
  },
  {
    neutral: "I am forgiven of all my sins and washed in the blood.",
    masculine: "{name} is forgiven of all his sins and washed in the blood.",
    feminine: "{name} is forgiven of all her sins and washed in the blood.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.1.7" target="_blank">Ephesians 1:7</a><br /><a href="https://www.bible.com/bible/59/HEB.9.14" target="_blank">Hebrews 9:14</a><br /><a href="https://www.bible.com/bible/59/COL.1.14" target="_blank">Colossians 1:14</a><br /><a href="https://www.bible.com/bible/59/1JN.2.12" target="_blank">1 John 2:12</a><br /><a href="https://www.bible.com/bible/59/1JN.1.9" target="_blank">1 John 1:9</a>',
  },
  {
    neutral: "I am a new creation.",
    masculine: "{name} is a new creation.",
    feminine: "{name} is a new creation.",
    verse:
      '<a href="https://www.bible.com/bible/59/2CO.5.17" target="_blank">2 Corinthians 5:17</a>',
  },
  {
    neutral: "I am a temple where the Holy Spirit lives.",
    masculine: "{name} is a temple where the Holy Spirit lives.",
    feminine: "{name} is a temple where the Holy Spirit lives.",
    verse:
      '<a href="https://www.bible.com/bible/59/1CO.6.19" target="_blank">1 Corinthians 6:19</a>',
  },
  {
    neutral:
      "I am delivered from the power of darkness; Christ brings me into God's kingdom.",
    masculine:
      "{name} is delivered from the power of darkness; Christ brings him into God's kingdom.",
    feminine:
      "{name} is delivered from the power of darkness; Christ brings her into God's kingdom.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.1.13" target="_blank">Colossians 1:13</a>',
  },
  {
    neutral: "I am redeemed from the curse of the law.",
    masculine: "{name} is redeemed from the curse of the law.",
    feminine: "{name} is redeemed from the curse of the law.",
    verse:
      '<a href="https://www.bible.com/bible/59/1PE.1" target="_blank">1 Peter 1:18-19</a>',
  },
  {
    neutral: "I am holy and without blame before God.",
    masculine: "{name} is holy and without blame before God.",
    feminine: "{name} is holy and without blame before God.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.1.4" target="_blank">Ephesians 1:4</a>',
  },
  {
    neutral: "I am established to the end.",
    masculine: "{name} is established to the end.",
    feminine: "{name} is established to the end.",
    verse:
      '<a href="https://www.bible.com/bible/59/1CO.1.8" target="_blank">1 Corinthians 1:8</a>',
  },
  {
    neutral: "I have been brought closer to God through the blood of Christ.",
    masculine:
      "{name} has been brought closer to God through the blood of Christ.",
    feminine:
      "{name} has been brought closer to God through the blood of Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.2.13" target="_blank">Ephesians 2:13</a>',
  },
  {
    neutral: "I am victorious.",
    masculine: "{name} is victorious.",
    feminine: "{name} is victorious.",
    verse:
      '<a href="https://www.bible.com/bible/59/REV.21.7" target="_blank">Revelation 21:7</a>',
  },
  {
    neutral: "I am set free.",
    masculine: "{name} is set free.",
    feminine: "{name} is set free.",
    verse:
      '<a href="https://www.bible.com/bible/59/JHN.8" target="_blank">John 8:31-32</a>',
  },
  {
    neutral: "I am strong in the Lord.",
    masculine: "{name} is strong in the Lord.",
    feminine: "{name} is strong in the Lord.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.6.10" target="_blank">Ephesians 6:10</a>',
  },
  {
    neutral: "I am dead to sin.",
    masculine: "{name} is dead to sin.",
    feminine: "{name} is dead to sin.",
    verse:
      '<a href="https://www.bible.com/bible/59/ROM.6" target="_blank">Romans 6:2 & 11</a>; <a href="https://www.bible.com/bible/59/1PE.2.24" target="_blank">1 Peter 2:24</a>',
  },
  {
    neutral: "I am more than a conqueror.",
    masculine: "{name} is more than a conqueror.",
    feminine: "{name} is more than a conqueror.",
    verse:
      '<a href="https://www.bible.com/bible/59/ROM.8.37" target="_blank">Romans 8:37</a>',
  },
  {
    neutral: "I am a co-heir with Christ.",
    masculine: "{name} is a co-heir with Christ.",
    feminine: "{name} is a co-heir with Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/ROM.8" target="_blank">Romans 8:16-17</a>',
  },
  {
    neutral: "I am sealed with the Holy Spirit of promise.",
    masculine: "{name} is sealed with the Holy Spirit of promise.",
    feminine: "{name} is sealed with the Holy Spirit of promise.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.1.13" target="_blank">Ephesians 1:13</a>',
  },
  {
    neutral: "I am in Christ Jesus by His doing.",
    masculine: "{name} is in Christ Jesus by His doing.",
    feminine: "{name} is in Christ Jesus by His doing.",
    verse:
      '<a href="https://www.bible.com/bible/59/1CO.1.30" target="_blank">1 Corinthians 1:30</a>',
  },
  {
    neutral: "I am accepted in Jesus Christ.",
    masculine: "{name} is accepted in Jesus Christ.",
    feminine: "{name} is accepted in Jesus Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.1.5" target="_blank">Ephesians 1:5-6</a>',
  },
  {
    neutral: "I am complete in Him.",
    masculine: "{name} is complete in Him.",
    feminine: "{name} is complete in Him.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.2.10" target="_blank">Colossians 2:10</a>',
  },
  {
    neutral: "I am crucified with Christ.",
    masculine: "{name} is crucified with Christ.",
    feminine: "{name} is crucified with Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/GAL.2.20" target="_blank">Galatians 2:20</a>',
  },
  {
    neutral: "I am alive with Christ.",
    masculine: "{name} is alive with Christ.",
    feminine: "{name} is alive with Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.2" target="_blank">Ephesians 2:4-5</a>',
  },
  {
    neutral: "I am free from condemnation.",
    masculine: "{name} is free from condemnation.",
    feminine: "{name} is free from condemnation.",
    verse:
      '<a href="https://www.bible.com/bible/59/ROM.8.1" target="_blank">Romans 8:1</a>',
  },
  {
    neutral: "I am reconciled to God.",
    masculine: "{name} is reconciled to God.",
    feminine: "{name} is reconciled to God.",
    verse:
      '<a href="https://www.bible.com/bible/59/2CO.5.18" target="_blank">2 Corinthians 5:18</a>',
  },
  {
    neutral: "I am qualified to share in His inheritance.",
    masculine: "{name} is qualified to share in His inheritance.",
    feminine: "{name} is qualified to share in His inheritance.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.1.12" target="_blank">Colossians 1:12</a>',
  },
  {
    neutral:
      "I am firmly rooted, established in my faith and overflowing with gratefulness and thankfulness.",
    masculine:
      "{name} is firmly rooted, established in his faith and overflowing with gratefulness and thankfulness.",
    feminine:
      "{name} is firmly rooted, established in her faith and overflowing with gratefulness and thankfulness.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.2.7" target="_blank">Colossians 2:7</a>',
  },
  {
    neutral: "I am called by God.",
    masculine: "{name} is called by God.",
    feminine: "{name} is called by God.",
    verse:
      '<a href="https://www.bible.com/bible/59/2TI.1.9" target="_blank">2 Timothy 1:9</a>',
  },
  {
    neutral: "I am chosen.",
    masculine: "{name} is chosen.",
    feminine: "{name} is chosen.",
    verse:
      '<a href="https://www.bible.com/bible/59/1TH.1.4" target="_blank">1 Thessalonians 1:4</a>; <a href="https://www.bible.com/bible/59/EPH.1.4" target="_blank">Ephesians 1:4</a>; <a href="https://www.bible.com/bible/59/1PE.2.9" target="_blank">1 Peter 2:9</a>',
  },
  {
    neutral: "I am an ambassador of Christ.",
    masculine: "{name} is an ambassador of Christ.",
    feminine: "{name} is an ambassador of Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/2CO.5.20" target="_blank">2 Corinthians 5:20</a>',
  },
  {
    neutral: "I am God's workmanship created in Christ Jesus for good works.",
    masculine:
      "{name} is God's workmanship created in Christ Jesus for good works.",
    feminine:
      "{name} is God's workmanship created in Christ Jesus for good works.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.2.10" target="_blank">Ephesians 2:10</a>',
  },
  {
    neutral: "I am the apple of my Father's eye.",
    masculine: "{name} is the apple of his Father's eye.",
    feminine: "{name} is the apple of her Father's eye.",
    verse:
      '<a href="https://www.bible.com/bible/59/DEU.32.10" target="_blank">Deuteronomy 32:10</a>; <a href="https://www.bible.com/bible/59/PSA.17.8" target="_blank">Psalm 17:8</a>',
  },
  {
    neutral: "I am healed by the stripes of Jesus.",
    masculine: "{name} is healed by the stripes of Jesus.",
    feminine: "{name} is healed by the stripes of Jesus.",
    verse:
      '<a href="https://www.bible.com/bible/59/1PE.2.24" target="_blank">1 Peter 2:24</a>; <a href="https://www.bible.com/bible/59/ISA.53.6" target="_blank">Isaiah 53:6</a>',
  },
  {
    neutral: "I am being changed into His image.",
    masculine: "{name} is being changed into His image.",
    feminine: "{name} is being changed into His image.",
    verse:
      '<a href="https://www.bible.com/bible/59/2CO.3.18" target="_blank">2 Corinthians 3:18</a>; <a href="https://www.bible.com/bible/59/PHP.1.6" target="_blank">Philippians 1:6</a>',
  },
  {
    neutral: "I am raised up with Christ and am seated in heavenly places.",
    masculine:
      "{name} is raised up with Christ and is seated in heavenly places.",
    feminine:
      "{name} is raised up with Christ and is seated in heavenly places.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.2.6" target="_blank">Ephesians 2:6</a>',
  },
  {
    neutral: "I am beloved of God.",
    masculine: "{name} is beloved of God.",
    feminine: "{name} is beloved of God.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.3.12" target="_blank">Colossians 3:12</a>; <a href="https://www.bible.com/bible/59/ROM.1.7" target="_blank">Romans 1:7</a>; <a href="https://www.bible.com/bible/59/1TH.1.4" target="_blank">1 Thessalonians 1:4</a>',
  },
  {
    neutral: "I have the mind of Christ.",
    masculine: "{name} has the mind of Christ.",
    feminine: "{name} has the mind of Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/PHP.2.5" target="_blank">Philippians 2:5</a>; <a href="https://www.bible.com/bible/59/1CO.2.16" target="_blank">1 Corinthians 2:16</a>',
  },
  {
    neutral: "I have obtained an inheritance.",
    masculine: "{name} has obtained an inheritance.",
    feminine: "{name} has obtained an inheritance.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.1.11" target="_blank">Ephesians 1:11</a>',
  },
  {
    neutral: "I have access by one Spirit to the Father.",
    masculine: "{name} has access by one Spirit to the Father.",
    feminine: "{name} has access by one Spirit to the Father.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.2.18" target="_blank">Ephesians 2:18</a>',
  },
  {
    neutral: "I have overcome the world.",
    masculine: "{name} has overcome the world.",
    feminine: "{name} has overcome the world.",
    verse:
      '<a href="https://www.bible.com/bible/59/1JN.5.4" target="_blank">1 John 5:4</a>',
  },
  {
    neutral: "I have everlasting life and will not be condemned.",
    masculine: "{name} has everlasting life and will not be condemned.",
    feminine: "{name} has everlasting life and will not be condemned.",
    verse:
      '<a href="https://www.bible.com/bible/59/JHN.5.24" target="_blank">John 5:24</a>; <a href="https://www.bible.com/bible/59/JHN.6.47" target="_blank">John 6:47</a>',
  },
  {
    neutral: "I have the peace of God that transcends all understanding.",
    masculine: "{name} has the peace of God that transcends all understanding.",
    feminine: "{name} has the peace of God that transcends all understanding.",
    verse:
      '<a href="https://www.bible.com/bible/59/PHP.4.7" target="_blank">Philippians 4:7</a>',
  },
  {
    neutral:
      "I have received power-the power of the Holy Spirit; power to lay hands on the sick and see them recover; power to cast out demons; power over all the power of the enemy; nothing shall by any means hurt me.",
    masculine:
      "{name} has received power-the power of the Holy Spirit; power to lay hands on the sick and see them recover; power to cast out demons; power over all the power of the enemy; nothing shall by any means hurt {name}.",
    feminine:
      "{name} has received power-the power of the Holy Spirit; power to lay hands on the sick and see them recover; power to cast out demons; power over all the power of the enemy; nothing shall by any means hurt {name}.",
    verse:
      '<a href="https://www.bible.com/bible/59/EPH.6.10" target="_blank">Mark 16:17-18</a>; <a href="https://www.bible.com/bible/59/EPH.6.10" target="_blank">Luke 10:17-19</a>',
  },
  {
    neutral: "I live by and in the law of the Spirit of Life in Christ Jesus.",
    masculine:
      "{name} lives by and in the law of the Spirit of Life in Christ Jesus.",
    feminine:
      "{name} lives by and in the law of the Spirit of Life in Christ Jesus.",
    verse:
      '<a href="https://www.bible.com/bible/59/ROM.8.2" target="_blank">Romans 8:2</a>',
  },
  {
    neutral: "I walk in Christ Jesus.",
    masculine: "{name} walks in Christ Jesus.",
    feminine: "{name} walks in Christ Jesus.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.2.6" target="_blank">Colossians 2:6</a>',
  },
  {
    neutral: "I can do all things in and through Christ Jesus.",
    masculine: "{name} can do all things in and through Christ Jesus.",
    feminine: "{name} can do all things in and through Christ Jesus.",
    verse:
      '<a href="https://www.bible.com/bible/59/PHP.4.13" target="_blank">Philippians 4:13</a>',
  },
  {
    neutral: "We shall do even greater things than Jesus did.",
    masculine: "{name} shall do even greater things than Jesus did.",
    feminine: "{name} shall do even greater things than Jesus did.",
    verse:
      '<a href="https://www.bible.com/bible/59/JHN.14.12" target="_blank">John 14:12</a>',
  },
  {
    neutral:
      "I possess the Great One in me because greater is He who is in me than he who is in the world.",
    masculine:
      "{name} possesses the Great One in himself because greater is He who is in {name} than he who is in the world.",
    feminine:
      "{name} possesses the Great One in herself because greater is He who is in {name} than he who is in the world.",
    verse:
      '<a href="https://www.bible.com/bible/59/1JN.4.4" target="_blank">1 John 4:4</a>',
  },
  {
    neutral:
      "I press toward the mark for the prize of the high calling of God.",
    masculine:
      "{name} presses toward the mark for the prize of the high calling of God.",
    feminine:
      "{name} presses toward the mark for the prize of the high calling of God.",
    verse:
      '<a href="https://www.bible.com/bible/59/PHP.3.14" target="_blank">Philippians 3:14</a>',
  },
  {
    neutral: "I always triumph in Christ.",
    masculine: "{name} always triumphs in Christ.",
    feminine: "{name} always triumphs in Christ.",
    verse:
      '<a href="https://www.bible.com/bible/59/2CO.2.14" target="_blank">2 Corinthians 2:14</a>',
  },
  {
    neutral: "My life shows forth his praise.",
    masculine: "{name}'s life shows forth his praise.",
    feminine: "{name}'s life shows forth his praise.",
    verse:
      '<a href="https://www.bible.com/bible/59/1PE.2.9" target="_blank">1 Peter 2:9</a>',
  },
  {
    neutral: "My life is hidden with Christ in God.",
    masculine: "{name}'s life is hidden with Christ in God.",
    feminine: "{name}'s life is hidden with Christ in God.",
    verse:
      '<a href="https://www.bible.com/bible/59/COL.3.3" target="_blank">Colossians 3:3</a>',
  },
];

export default function LoadData() {
  const router = useRouter();
  if (typeof window !== "undefined" && !localStorage.getItem("data")) {
    console.log("Loading data...");
    localStorage.setItem("data", JSON.stringify(data));
    router.refresh();
  }

  return null;
}
