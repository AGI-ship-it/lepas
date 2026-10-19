// Source: lepasuae.com/privacy-policy (Al Ghurair Investment LLC Privacy Notice), verbatim.
export type PolicyListItem = string | { text: string; items: string[] };

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: PolicyListItem[] };

export interface PolicySection {
  id: string;
  title: string;
  blocks: PolicyBlock[];
}

export interface PolicyDocument {
  introTitle: string;
  intro: PolicyBlock[];
  sections: PolicySection[];
}

export const privacyPolicy: Record<"en" | "ar", PolicyDocument> = {
  en: {
    introTitle: "1. Overview",
    intro: [
  {
    "type": "h3",
    "text": "1.1. Purpose of this Privacy Notice"
  },
  {
    "type": "p",
    "text": "Al Ghurair Investment LLC takes privacy seriously. Al Ghurair Investment LLC’s business is organised around strategic sector themes such as mobility, infrastructure, foods, etc. This privacy notice applies to all the sector themes within Al Ghurair Investment LLC (“Al Ghurair)."
  },
  {
    "type": "p",
    "text": "Al Ghurair (“we”, “our”, or “us”) are committed to respecting your Personal Data and complying with the relevant laws including, without limitation, the United Arab Emirates Federal Decree Law No. 45 of 2021 on Personal Data Protection (“UAE PDPL”), the Dubai International Financial Centre Law No. 5 of 2020 on Data Protection (“DIFC DPL”) and European Union General Data Protection Regulation 2016/679 (“GDPR”) (“applicable legislation”). For the purposes of this Privacy Notice “Personal Data” means any information relating to an identified natural person, or a natural person who can be identified, directly or indirectly from the data."
  },
  {
    "type": "p",
    "text": "This Privacy Notice contains information on what Personal Data we collect, what we do with that information, and what rights you have. This Privacy Notice has been prepared with reference to applicable legislation considerations and will be augmented by jurisdictional specific addendums from time to time."
  },
  {
    "type": "p",
    "text": "We are committed to safeguarding the privacy of the Personal Data that we process in the course of our business, including the Personal Data we receive from you (“you” or “your”) and from third parties. This Privacy Notice describes how and why we collect, store and use Personal Data, and provides information about the rights of the individuals to whom such Personal Data relates."
  },
  {
    "type": "p",
    "text": "For the purposes of applicable legislation, Al Ghurair are typically the “Controller” of any Personal Data provided to us. Specifically, the data that you have provided and communicated to us will be controlled, collected and processed by Al Ghurair. Very occasionally, we will act on specific retainers as a “Processor” (meaning that we process Personal Data only in accordance with the directions of a Controller, or as otherwise permitted by law)."
  },
  {
    "type": "p",
    "text": "Please read the following information carefully to understand our practices regarding how we handle your Personal Data. If you have any queries about our approach to data protection that are not already addressed in this Privacy Notice, please contact our Data Protection Officer, using the contact details set out at the end of this Privacy Notice."
  },
  {
    "type": "h3",
    "text": "1.2 Scope"
  },
  {
    "type": "p",
    "text": "This Privacy Notice applies to persons anywhere in the world who has access to, or who uses, websites, apps or any other digital platforms (including social media) (“Online Services”) owned by the Al Ghurair."
  },
  {
    "type": "h3",
    "text": "1.3. Principles"
  },
  {
    "type": "p",
    "text": "We will comply with applicable legislation that apply to our processing of your Personal Data. We will:"
  },
  {
    "type": "ul",
    "items": [
      "process your Personal Data in a fair, lawful and transparent way;",
      "collect your Personal Data only for clear and specific purposes as explained to you when collecting your Personal Data;",
      "not use your Personal Data in any way that is incompatible with those purposes;",
      "process your Personal Data in a manner that is adequate and relevant to the purposes for which we have collected it and limited only to those purposes;",
      "not retain your Personal Data after achieving the purpose for which it is processed;",
      "keep your Personal Data secure, correct, accurate and, where necessary, up to date; and",
      "keep your Personal Data in a form that identifies you only as long as necessary for the purposes we have informed you and/or as permitted by law."
    ]
  }
],
    sections: [
  {
    "id": "2-collection-of-personal-data",
    "title": "2. Collection of Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "We may collect Personal Data from you by electronic and/or physical means in the course of our business, when you contact us or request information from us, when you use our Online Services, or as a result of your relationship with any of our personnel or clients."
      },
      {
        "type": "p",
        "text": "The Personal Data that we process includes:"
      },
      {
        "type": "ul",
        "items": [
          "basic details, such as your first & last name, nationality, date of birth, role/title, employer/s, your relationship to a person, your contact information (such as your email address, physical address, contact details, mobile number & landline number, office number, fax number,O. Box Number) and other information related to the emergency contact person, such as:",
          "Name of person.",
          "Mobile or landline number of contact person.",
          "Email ID of contact person.",
          "biometric data for the purpose of authentication in mobile apps;",
          "technical information (including your location, IP address, browser details, traffic data, location data), such as information from your visits to our Online Services (page interaction information, length of visits, etc.), or in relation to marketing emails we send to you;",
          "information relating to your visits to our offices or our meetings and events, including appointment details (e.g. time, location, participants) or photographic and video images;",
          "call recording if you reach out to us by phone, for quality and training purposes;",
          "Personal Data provided to us by or on behalf of our clients/customers, or generated by us in the course or providing services to them, which may include special categories of Personal Data such as health information (“Sensitive Personal Data”);",
          "any other information relating to you which you may provide to us."
        ]
      },
      {
        "type": "p",
        "text": "We may collect your Personal Data:"
      },
      {
        "type": "ul",
        "items": [
          "as part of our new business intake and client on-boarding or client maintenance activities;",
          "when you seek employment from us, as part of our new employee on-boarding and maintenance of the employment relationship;",
          "when you provide (or offer to provide) services to us, either yourself or on behalf of your employer;",
          "when we are acting on a matter where you or your employer are a party to the same;",
          "when you interact with our Online Services, or use any of our online services;"
        ]
      },
      {
        "type": "p",
        "text": "when you interact with us in respect of any of our marketing communications or events."
      },
      {
        "type": "p",
        "text": "We collect most of this information directly from you, through your use of our Online Services operated by Al Ghurair business, or any service provided by Al Ghurair. Furthermore, we may run pages and accounts in various social media sites to inform and engage with our customers and general public. We may monitor and record comments, reactions or visual representation of emotions made on these channels about us to improve customer experience."
      },
      {
        "type": "p",
        "text": "We work closely with third parties (including, business partners, vendors, suppliers, sub-contractors, advertising networks, analytics providers, search information providers, customer survey providers, etc.) and may receive information about you from them. Where we obtain your information from a third party, we may ask them to provide you with a copy of this Privacy Notice to ensure that you know we are processing your information and the purpose for such processing."
      },
      {
        "type": "p",
        "text": "The information you provide may be confidential, and we will maintain such confidentiality and protect your information in accordance with our professional obligations and applicable legislation. If you tell us you do not want Al Ghurair to use your Personal Data, Al Ghurair will respect your wishes. Where we need to collect your Personal Data by law or in order to process your instructions or provide you with our Online Services and you decide not to provide that information when requested, we may not be able to carry out your instructions, provide our Online Services or provide certain of our other products and services."
      }
    ]
  },
  {
    "id": "3-use-purpose-of-personal-data",
    "title": "3. Use / Purpose of Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "We always process your Personal Data for a specific purpose and only process the Personal Data which is relevant to achieve that purpose. The purposes for which we process your Personal Data are as follows:"
      },
      {
        "type": "ul",
        "items": [
          "providing professional services where this is necessary or appropriate;",
          "processing your orders;",
          "communicating with you in connection to your request;",
          "verifying your identity and information in your job application, and",
          "managing the accounts you hold with us."
        ]
      },
      {
        "type": "p",
        "text": "We may also use your Personal Data to personalise the marketing messages we send to you and to make them more relevant and interesting, as this is in our legitimate business interests. Where required under applicable legislation, we will obtain your consent first. We may use your Personal Data for this purpose in the following ways:"
      },
      {
        "type": "ul",
        "items": [
          "using your online browsing behaviour to help us better understand you as a customer and provide you with personalized offers and services;",
          "providing you with relevant marketing communications (including by email, post, telephone, SMS, or online advertising), relating to products and services we offer, and those of our suppliers and partners;",
          "helping us to better understand you and provide you with services and marketing communications, that are relevant to your interests. To do this we combine Personal Data we collect with Personal Data collected from our Online Services."
        ]
      }
    ]
  },
  {
    "id": "4-legal-basis",
    "title": "4. Legal Basis",
    "blocks": [
      {
        "type": "p",
        "text": "Whether we receive your Personal Data directly from you or from a third party, we will only use your Personal Data if we have obtained your consent (where this is required under applicable law), or if we have another lawful basis upon which to do so."
      },
      {
        "type": "p",
        "text": "Depending on the purpose of the processing activity, the legal basis for the processing of your Personal Data will be one of the following (depending on the jurisdiction):"
      },
      {
        "type": "ul",
        "items": [
          "necessary to perform our contractual obligations towards you or to take pre-contractual steps at your request;",
          "necessary to meet our legal or regulatory obligations in accordance with applicable legislation;",
          "necessary for the performance of a task carried out in the public interest;",
          "necessary to protect the vital interests of the relevant individual or of another natural person;",
          "necessary for the legitimate interests of Al Ghurair, without unduly affecting your interests or fundamental rights and freedoms and to the extent such Personal Data is strictly necessary for the intended purpose; or",
          "in some cases, where required by applicable law, where we have obtained prior consent from you."
        ]
      },
      {
        "type": "p",
        "text": "We may process Sensitive Personal Data in the following circumstances:"
      },
      {
        "type": "ul",
        "items": [
          "with your explicit written consent;",
          "where we need to carry out our legal obligations; or",
          "where it is needed in the public interest."
        ]
      }
    ]
  },
  {
    "id": "5-consent",
    "title": "5. Consent",
    "blocks": [
      {
        "type": "p",
        "text": "Where we process your Personal Data based on your consent, you have the right to withdraw your consent at any time. To withdraw your consent, please contact us using the contact details stated at the end of this Privacy Notice. Once Al Ghurair has received notification that you have withdrawn your consent, we will no longer process your Personal Data for the purpose(s) to which you originally consented unless there is another legal basis for the processing. Please note that where Al Ghurair relies on your consent to process your Personal Data and you choose to withdraw your consent, your decision may affect our ability to provide our Online Services and our other products and services."
      }
    ]
  },
  {
    "id": "6-sharing-of-personal-data",
    "title": "6. Sharing of Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "We may share Personal Data for the purposes indicated in Section 3 of this Privacy Notice with:"
      },
      {
        "type": "ul",
        "items": [
          "Third party service providers and sub-contractors (including but not limited to IT service providers);",
          "Any Al Ghurair affiliate; and",
          "Any competent authorities, for example if we are legally required to comply with a request for Personal Data."
        ]
      },
      {
        "type": "p",
        "text": "We do not sell, rent, distribute, or otherwise make, Personal Data commercially available to any third party. Where we transfer your data to third party service providers, we take steps to ensure they meet our data security standards, so that your Personal Data remains secure. In addition, we do not allow our third-party service providers to use your Personal Data for their own purposes. We will only permit them to process your Personal Data for specified purposes and in accordance with our instructions."
      }
    ]
  },
  {
    "id": "7-storage-and-transfer-of-personal-data",
    "title": "7. Storage and Transfer of Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "The Al Ghurair Online Services will be managed and operated from the UAE. The information collected from you via the Online Services will be processed internally and stored on servers based in the UAE. It is not transferred outside the UAE in the usual course of our business."
      },
      {
        "type": "p",
        "text": "We will only transfer your data outside of the UAE if:"
      },
      {
        "type": "ul",
        "items": [
          "the country or location we are transferring your Personal Data is providing an adequate level of protection as approved by the relevant data regulator.",
          "the third party to which the Personal Data is transferred has provided appropriate safeguards that ensure the security of your Personal Data, in line with applicable legislation, such as the execution of Standard Contractual Clauses approved by the European Commission and DIFC Commissioner of Data Protection;",
          "we have your explicit consent to the proposed data transfer after being informed of any potential risks; or the transfer is necessary for one of the other reasons under applicable legislation."
        ]
      },
      {
        "type": "p",
        "text": "By providing your Personal Data to the Al Ghurair Online Services, you acknowledge this transfer, storing or processing."
      },
      {
        "type": "p",
        "text": "Al Ghurair will take all steps reasonably necessary to ensure your Personal Data is treated securely, to prevent unauthorised access or disclosure and in accordance with this Privacy Notice."
      },
      {
        "type": "p",
        "text": "If some transfers of your Personal Data may be made to the countries or jurisdictions with data protection or privacy laws that are not adequate (non-adequate jurisdictions) in comparison with the applicable legislation where you reside, we will take appropriate measures to protect Personal Data in accordance with the applicable legislation, for example by putting in place an appropriate legal framework to protect your Personal Data."
      },
      {
        "type": "p",
        "text": "If you would like further details of how your Personal Data is protected when transferred from one country to another then please email us at [DataProtection.Officer@al-ghurair.com](mailto:DataProtection.Officer@al-ghurair.com)."
      }
    ]
  },
  {
    "id": "8-your-data-protection-rights",
    "title": "8. Your Data Protection Rights",
    "blocks": [
      {
        "type": "p",
        "text": "Under certain conditions you may have the right to require us to:"
      },
      {
        "type": "ul",
        "items": [
          "provide you with further details on the use we make of your Personal Data;",
          "confirm whether we process Personal Data about you and (where this is the case) provide you with access to the Personal Data we hold about you;",
          "update any inaccuracies in the Personal Data we hold about you;",
          "delete any of your Personal Data that we no longer have a legal basis to use;",
          "where processing is based on consent, stop that processing by withdrawing your consent (which you may do at any time);",
          "object to any processing based on our legitimate interests unless our reasons for undertaking that processing outweigh any prejudice to your data protection rights, or object to direct marketing purposes;",
          "restrict how we use your Personal Data whilst a complaint is being investigated; and/or",
          "transfer your Personal Data to you or to a third party in a standardised machine-readable format."
        ]
      },
      {
        "type": "p",
        "text": "Please note that some of the rights listed above may be limited where we have an overriding interest or legal obligation to continue to process your Personal Data or not disclose the same."
      },
      {
        "type": "p",
        "text": "Your requests concerning the Personal Data collect will be addressed in compliance with this Privacy Notice and applicable legislation."
      },
      {
        "type": "p",
        "text": "When you submit a request, our team will verify your identity to ensure the security and privacy of your Personal Data. We aim to respond to all requests within the time periods specified under applicable legislation. In the event your request is particularly complex, we will notify you and keep you updated."
      },
      {
        "type": "p",
        "text": "To exercise any of your rights, please write to the address stated at the end of this Privacy Notice to report your concerns and we will take appropriate steps to fulfil your request."
      },
      {
        "type": "p",
        "text": "If you are not satisfied with our use of your Personal Data or our response to any request by you to exercise your rights, or if you think that we have breached any relevant applicable legislation, then you have the right to complain to the authority that supervises our processing of your Personal Data."
      },
      {
        "type": "p",
        "text": "If you feel that we do not comply with applicable legislation, you may lodge a complaint with a competent data protection authority. These are as follows:"
      },
      {
        "type": "p",
        "text": "Dubai International Financial Centre: DIFC Commissioner of Data Protection"
      },
      {
        "type": "p",
        "text": "United Arab Emirates: The UAE Data Office"
      },
      {
        "type": "p",
        "text": "European Union: The Data Protection Authority of the European country where you reside"
      }
    ]
  },
  {
    "id": "9-children-s-privacy",
    "title": "9. Children’s Privacy",
    "blocks": [
      {
        "type": "p",
        "text": "Al Ghurair does not knowingly collect the information of, or make contact with, children, including to participate in customer research activities. If you are aged 21 or under, please obtain your parent/guardian’s permission before you provide any Personal Data via the Al Ghurair Online Services. Users aged 21 or under without such consent are not allowed to provide us with Personal Data."
      }
    ]
  },
  {
    "id": "10-cookies",
    "title": "10. Cookies",
    "blocks": [
      {
        "type": "p",
        "text": "Cookies are small pieces of information that your browser stores on your computer when requested by a website. You have the option to configure your browser to reject all or specific browser cookies, or to notify you when websites set or access cookies. Please be aware that if you disable or refuse cookies, certain parts of the Online Services may become inaccessible or may not function correctly. For additional information regarding the cookies we utilise, please refer to our [Cookies Policy](https://www.lepasuae.com/cookie-policy)"
      }
    ]
  },
  {
    "id": "11-data-retention",
    "title": "11. Data Retention",
    "blocks": [
      {
        "type": "p",
        "text": "We will retain your Personal Data for the length of time needed to fulfil the purposes for which the Personal Data was collected, unless we specifically agree a longer retention period with you, or a longer retention period is required or permitted by applicable legislation."
      },
      {
        "type": "p",
        "text": "Our retention periods are based on the requirements of relevant applicable legislation and the purpose for which the Personal Data is collected and used, taking into account legal and regulatory requirements to retain the Personal Data for a minimum period, limitation periods for taking legal action, good practice and our business purposes. In addition, we consider the amount, nature, and sensitivity of the Personal Data, the potential risk of harm from unauthorised use or disclosure of your Personal Data, the purposes for which we process your Personal Data and whether we can achieve such purposes through other means."
      },
      {
        "type": "p",
        "text": "We will destroy or anonymise your Personal Data as soon as the purpose of collecting it, or the legal requirement for which are required to keep the Personal Data, has expired."
      },
      {
        "type": "p",
        "text": "At any time, you can ask for your stored information to be deleted from the Al Ghurair’s database using the contact details below. However, some of your Personal Data may be retained in some circumstances, such as to resolve disputes, troubleshoot problems, enforce terms and conditions or as required by regulators. Further, in some circumstances such Personal Data is never entirely removed from databases due to technical constraints and systems back-ups."
      }
    ]
  },
  {
    "id": "12-how-we-protect-your-personal-data",
    "title": "12. How we protect your Personal Data",
    "blocks": [
      {
        "type": "p",
        "text": "We have implemented reasonable administrative, technical, and physical measures to protect your Personal Data against loss, misuse and alteration. However, no internet-based site can be 100% secure and we cannot be held responsible for unauthorised or unintended access that is beyond our control."
      },
      {
        "type": "p",
        "text": "We have put in place procedures to deal with any suspected data security breach and will notify you and any applicable regulator of a suspected breach where we are legally required to do so."
      }
    ]
  },
  {
    "id": "13-profiling",
    "title": "13. Profiling",
    "blocks": [
      {
        "type": "p",
        "text": "Al Ghurair does not use profiling (where an electronic system uses personal data to try and predict something about you) or automated decision making (where an electronic system uses personal data to make a decision about you without human intervention)."
      }
    ]
  },
  {
    "id": "14-hyperlinks",
    "title": "14. Hyperlinks",
    "blocks": [
      {
        "type": "p",
        "text": "Our Online Services may provide links to third-party websites for your convenience. If you access those links, you will leave our Online Services. We do not control those third-party websites or their privacy practices, which may differ from ours. We do not endorse or make any representations about third-party websites. This Privacy Notice does not cover the personal data you choose to give to unrelated third parties. We encourage you to review the privacy notice of any company before submitting your Personal Data. Some third-party companies may choose to share Personal Data with us; that sharing is governed by that third-party company’s privacy policy."
      }
    ]
  },
  {
    "id": "15-local-differences",
    "title": "15. Local differences",
    "blocks": [
      {
        "type": "p",
        "text": "Whilst this Privacy Notice describes the data protection practices adopted by us generally across the UAE (mainland and DIFC) and EU, local data protection laws may vary and our operations in some countries may mean that we are subject to different, or additional, local data protection requirements. As explained above, this Privacy Notice will be augmented by jurisdictional specific addendums from time to time as applicable."
      }
    ]
  },
  {
    "id": "16-changes-to-the-privacy-notice",
    "title": "16. Changes to the Privacy Notice",
    "blocks": [
      {
        "type": "p",
        "text": "We update this Privacy Notice to ensure compliance with the applicable legislation. If we are going to use your Personal Data in a manner different from that stated at the time of collection, we will notify you. All changes will become effective when posted unless indicated otherwise."
      },
      {
        "type": "p",
        "text": "Please review this Privacy Notice periodically for changes."
      },
      {
        "type": "p",
        "text": "This Privacy Notice was last updated in August 2026."
      }
    ]
  },
  {
    "id": "17-contact-details",
    "title": "17. Contact Details",
    "blocks": [
      {
        "type": "p",
        "text": "If you have any concerns about our compliance with applicable legislation or this Privacy Notice, please use the contact details below:"
      },
      {
        "type": "h3",
        "text": "Data Protection Officer"
      },
      {
        "type": "p",
        "text": "Al Ghurair – Corporate Office"
      },
      {
        "type": "p",
        "text": "Dubai, United Arab Emirates"
      },
      {
        "type": "p",
        "text": "Post Box No. 5326"
      },
      {
        "type": "p",
        "text": "E-mail: [DataProtection.Officer@al-ghurair.com](mailto:DataProtection.Officer@al-ghurair.com)"
      },
      {
        "type": "p",
        "text": "We will endeavour to respond to your concerns as soon as possible."
      }
    ]
  }
],
  },
  ar: {
    introTitle: "1. نظرة عامة",
    intro: [
  {
    "type": "h3",
    "text": "1.1. الغرض من إشعار الخصوصية هذا"
  },
  {
    "type": "p",
    "text": "تأخذ شركة الغرير للاستثمار ذ.م.م الخصوصية على محمل الجد. تُنظَّم أعمال شركة الغرير للاستثمار ذ.م.م حول محاور قطاعية استراتيجية مثل التنقل والبنية التحتية والأغذية وغيرها. ينطبق إشعار الخصوصية هذا على جميع المحاور القطاعية ضمن شركة الغرير للاستثمار ذ.م.م (\"الغرير\")."
  },
  {
    "type": "p",
    "text": "تلتزم الغرير (\"نحن\" أو \"لنا\" أو \"خاصتنا\") باحترام بياناتك الشخصية والامتثال للقوانين ذات الصلة، بما في ذلك على سبيل المثال لا الحصر: المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية في دولة الإمارات العربية المتحدة (\"قانون حماية البيانات الشخصية الإماراتي\")، وقانون مركز دبي المالي العالمي رقم 5 لسنة 2020 بشأن حماية البيانات (\"قانون حماية البيانات لمركز دبي المالي العالمي\")، واللائحة العامة لحماية البيانات في الاتحاد الأوروبي رقم 2016/679 (\"اللائحة العامة لحماية البيانات\") (\"التشريعات المعمول بها\"). لأغراض إشعار الخصوصية هذا، تعني \"البيانات الشخصية\" أي معلومات تتعلق بشخص طبيعي محدد الهوية، أو بشخص طبيعي يمكن التعرف على هويته بشكل مباشر أو غير مباشر من خلال البيانات."
  },
  {
    "type": "p",
    "text": "يتضمن إشعار الخصوصية هذا معلومات حول البيانات الشخصية التي نجمعها، وما نفعله بتلك المعلومات، والحقوق التي تتمتع بها. وقد أُعدّ إشعار الخصوصية هذا بالرجوع إلى اعتبارات التشريعات المعمول بها، وسيُستكمل بملاحق خاصة بكل ولاية قضائية من وقت لآخر."
  },
  {
    "type": "p",
    "text": "نلتزم بصون خصوصية البيانات الشخصية التي نعالجها أثناء ممارسة أعمالنا، بما في ذلك البيانات الشخصية التي نتلقاها منك (\"أنت\" أو \"خاصتك\") ومن الأطراف الثالثة. ويوضح إشعار الخصوصية هذا كيف ولماذا نجمع البيانات الشخصية ونخزنها ونستخدمها، ويقدم معلومات حول حقوق الأفراد الذين تتعلق بهم هذه البيانات الشخصية."
  },
  {
    "type": "p",
    "text": "لأغراض التشريعات المعمول بها، تكون الغرير عادةً \"المتحكّم\" في أي بيانات شخصية تُقدَّم إلينا. وعلى وجه التحديد، ستتحكم الغرير في البيانات التي قدمتها وأبلغتنا بها، وستجمعها وتعالجها. وفي حالات نادرة جدًا، سنعمل بموجب تكليفات محددة بصفتنا \"معالِجًا\" (أي أننا نعالج البيانات الشخصية وفقًا لتوجيهات المتحكّم فقط، أو وفقًا لما يسمح به القانون)."
  },
  {
    "type": "p",
    "text": "يُرجى قراءة المعلومات التالية بعناية لفهم ممارساتنا المتعلقة بكيفية تعاملنا مع بياناتك الشخصية. إذا كانت لديك أي استفسارات حول نهجنا في حماية البيانات لم يتناولها إشعار الخصوصية هذا، يُرجى التواصل مع مسؤول حماية البيانات لدينا باستخدام بيانات الاتصال الواردة في نهاية إشعار الخصوصية هذا."
  },
  {
    "type": "h3",
    "text": "1.2 النطاق"
  },
  {
    "type": "p",
    "text": "ينطبق إشعار الخصوصية هذا على الأشخاص في أي مكان في العالم ممن يصلون إلى المواقع الإلكترونية أو التطبيقات أو أي منصات رقمية أخرى (بما في ذلك وسائل التواصل الاجتماعي) (\"الخدمات الإلكترونية\") المملوكة للغرير أو يستخدمونها."
  },
  {
    "type": "h3",
    "text": "1.3. المبادئ"
  },
  {
    "type": "p",
    "text": "سنلتزم بالتشريعات المعمول بها التي تنطبق على معالجتنا لبياناتك الشخصية. وسنقوم بما يلي:"
  },
  {
    "type": "ul",
    "items": [
      "معالجة بياناتك الشخصية بطريقة عادلة وقانونية وشفافة؛",
      "جمع بياناتك الشخصية لأغراض واضحة ومحددة فقط، على النحو الموضح لك عند جمع بياناتك الشخصية؛",
      "عدم استخدام بياناتك الشخصية بأي طريقة تتعارض مع تلك الأغراض؛",
      "معالجة بياناتك الشخصية بطريقة كافية وذات صلة بالأغراض التي جمعناها من أجلها، ومقتصرة على تلك الأغراض فقط؛",
      "عدم الاحتفاظ ببياناتك الشخصية بعد تحقيق الغرض الذي عولجت من أجله؛",
      "الحفاظ على بياناتك الشخصية آمنة وصحيحة ودقيقة، ومحدّثة عند الضرورة؛",
      "الاحتفاظ ببياناتك الشخصية بصيغة تُعرّف بك فقط للمدة اللازمة للأغراض التي أبلغناك بها و/أو وفقًا لما يسمح به القانون."
    ]
  }
],
    sections: [
  {
    "id": "2-collection-of-personal-data",
    "title": "2. جمع البيانات الشخصية",
    "blocks": [
      {
        "type": "p",
        "text": "قد نجمع بياناتك الشخصية بوسائل إلكترونية و/أو مادية أثناء ممارسة أعمالنا، أو عند تواصلك معنا أو طلبك معلومات منا، أو عند استخدامك لخدماتنا الإلكترونية، أو نتيجة لعلاقتك بأي من موظفينا أو عملائنا."
      },
      {
        "type": "p",
        "text": "تشمل البيانات الشخصية التي نعالجها ما يلي:"
      },
      {
        "type": "ul",
        "items": [
          "البيانات الأساسية، مثل اسمك الأول واسم العائلة، والجنسية، وتاريخ الميلاد، والدور/المسمى الوظيفي، وجهة/جهات العمل، وعلاقتك بشخص ما، وبيانات الاتصال الخاصة بك (مثل عنوان بريدك الإلكتروني، والعنوان الفعلي، وبيانات الاتصال، ورقم الهاتف المتحرك والهاتف الأرضي، ورقم المكتب، ورقم الفاكس، ورقم صندوق البريد)، وغيرها من المعلومات المتعلقة بشخص الاتصال في حالات الطوارئ، مثل:",
          "اسم الشخص.",
          "رقم الهاتف المتحرك أو الأرضي لشخص الاتصال.",
          "البريد الإلكتروني لشخص الاتصال.",
          "البيانات البيومترية لغرض المصادقة في تطبيقات الهاتف المتحرك؛",
          "المعلومات التقنية (بما في ذلك موقعك، وعنوان IP، وتفاصيل المتصفح، وبيانات حركة المرور، وبيانات الموقع)، مثل المعلومات المتعلقة بزياراتك لخدماتنا الإلكترونية (معلومات التفاعل مع الصفحات، ومدة الزيارات، وغيرها)، أو المتعلقة برسائل البريد الإلكتروني التسويقية التي نرسلها إليك؛",
          "المعلومات المتعلقة بزياراتك لمكاتبنا أو اجتماعاتنا وفعالياتنا، بما في ذلك تفاصيل المواعيد (مثل الوقت والمكان والمشاركين) أو الصور الفوتوغرافية ومقاطع الفيديو؛",
          "تسجيل المكالمات إذا تواصلت معنا هاتفيًا، لأغراض الجودة والتدريب؛",
          "البيانات الشخصية المقدَّمة إلينا من قِبل عملائنا أو نيابةً عنهم، أو التي ننشئها أثناء تقديم الخدمات لهم، والتي قد تشمل فئات خاصة من البيانات الشخصية مثل المعلومات الصحية (\"البيانات الشخصية الحساسة\")؛",
          "أي معلومات أخرى تتعلق بك قد تقدمها إلينا."
        ]
      },
      {
        "type": "p",
        "text": "قد نجمع بياناتك الشخصية:"
      },
      {
        "type": "ul",
        "items": [
          "كجزء من أنشطة استقبال الأعمال الجديدة وتسجيل العملاء الجدد أو أنشطة إدارة العملاء؛",
          "عند تقدمك بطلب توظيف لدينا، كجزء من إجراءات تعيين الموظفين الجدد وإدارة علاقة العمل؛",
          "عندما تقدم (أو تعرض تقديم) خدمات لنا، سواء بنفسك أو نيابةً عن جهة عملك؛",
          "عندما نتولى أمرًا تكون أنت أو جهة عملك طرفًا فيه؛",
          "عند تفاعلك مع خدماتنا الإلكترونية أو استخدامك لأي من خدماتنا الإلكترونية؛"
        ]
      },
      {
        "type": "p",
        "text": "عند تفاعلك معنا فيما يتعلق بأي من اتصالاتنا أو فعالياتنا التسويقية."
      },
      {
        "type": "p",
        "text": "نجمع معظم هذه المعلومات منك مباشرةً، من خلال استخدامك لخدماتنا الإلكترونية التي تديرها أعمال الغرير، أو أي خدمة تقدمها الغرير. علاوة على ذلك، قد ندير صفحات وحسابات على مواقع التواصل الاجتماعي المختلفة لإطلاع عملائنا والجمهور العام والتفاعل معهم. وقد نراقب ونسجل التعليقات أو التفاعلات أو التعبيرات المرئية عن المشاعر التي تُنشر على هذه القنوات بشأننا، بهدف تحسين تجربة العملاء."
      },
      {
        "type": "p",
        "text": "نعمل بشكل وثيق مع أطراف ثالثة (بما في ذلك شركاء الأعمال، والبائعين، والموردين، والمقاولين من الباطن، وشبكات الإعلان، ومزودي خدمات التحليلات، ومزودي معلومات البحث، ومزودي استطلاعات العملاء، وغيرهم)، وقد نتلقى منهم معلومات عنك. وعندما نحصل على معلوماتك من طرف ثالث، قد نطلب منه تزويدك بنسخة من إشعار الخصوصية هذا لضمان علمك بأننا نعالج معلوماتك وبالغرض من هذه المعالجة."
      },
      {
        "type": "p",
        "text": "قد تكون المعلومات التي تقدمها سرية، وسنحافظ على هذه السرية ونحمي معلوماتك وفقًا لالتزاماتنا المهنية والتشريعات المعمول بها. وإذا أخبرتنا أنك لا ترغب في أن تستخدم الغرير بياناتك الشخصية، فستحترم الغرير رغبتك. وعندما نحتاج إلى جمع بياناتك الشخصية بموجب القانون أو لتنفيذ تعليماتك أو لتقديم خدماتنا الإلكترونية لك، وقررت عدم تقديم تلك المعلومات عند طلبها، فقد لا نتمكن من تنفيذ تعليماتك أو تقديم خدماتنا الإلكترونية أو تقديم بعض منتجاتنا وخدماتنا الأخرى."
      }
    ]
  },
  {
    "id": "3-use-purpose-of-personal-data",
    "title": "3. استخدام البيانات الشخصية والغرض منها",
    "blocks": [
      {
        "type": "p",
        "text": "نعالج بياناتك الشخصية دائمًا لغرض محدد، ولا نعالج إلا البيانات الشخصية ذات الصلة بتحقيق ذلك الغرض. والأغراض التي نعالج من أجلها بياناتك الشخصية هي كما يلي:"
      },
      {
        "type": "ul",
        "items": [
          "تقديم الخدمات المهنية عندما يكون ذلك ضروريًا أو مناسبًا؛",
          "معالجة طلباتك؛",
          "التواصل معك فيما يتعلق بطلبك؛",
          "التحقق من هويتك ومن المعلومات الواردة في طلب التوظيف الخاص بك؛ و",
          "إدارة الحسابات التي تملكها لدينا."
        ]
      },
      {
        "type": "p",
        "text": "قد نستخدم بياناتك الشخصية أيضًا لتخصيص الرسائل التسويقية التي نرسلها إليك وجعلها أكثر صلة وإثارة لاهتمامك، إذ يندرج ذلك ضمن مصالحنا التجارية المشروعة. وعندما تقتضي التشريعات المعمول بها ذلك، سنحصل على موافقتك أولًا. وقد نستخدم بياناتك الشخصية لهذا الغرض بالطرق التالية:"
      },
      {
        "type": "ul",
        "items": [
          "استخدام سلوك تصفحك عبر الإنترنت لمساعدتنا على فهمك بشكل أفضل كعميل وتقديم عروض وخدمات مخصصة لك؛",
          "تزويدك باتصالات تسويقية ذات صلة (بما في ذلك عبر البريد الإلكتروني، أو البريد العادي، أو الهاتف، أو الرسائل النصية القصيرة، أو الإعلانات عبر الإنترنت)، تتعلق بالمنتجات والخدمات التي نقدمها، وتلك التي يقدمها موردونا وشركاؤنا؛",
          "مساعدتنا على فهمك بشكل أفضل وتقديم خدمات واتصالات تسويقية ذات صلة باهتماماتك. وللقيام بذلك، ندمج البيانات الشخصية التي نجمعها مع البيانات الشخصية التي تُجمع من خدماتنا الإلكترونية."
        ]
      }
    ]
  },
  {
    "id": "4-legal-basis",
    "title": "4. الأساس القانوني",
    "blocks": [
      {
        "type": "p",
        "text": "سواء تلقينا بياناتك الشخصية منك مباشرةً أو من طرف ثالث، فلن نستخدم بياناتك الشخصية إلا إذا حصلنا على موافقتك (عندما يقتضي القانون المعمول به ذلك)، أو إذا كان لدينا أساس قانوني آخر للقيام بذلك."
      },
      {
        "type": "p",
        "text": "بحسب الغرض من نشاط المعالجة، سيكون الأساس القانوني لمعالجة بياناتك الشخصية واحدًا مما يلي (بحسب الولاية القضائية):"
      },
      {
        "type": "ul",
        "items": [
          "ضرورية لأداء التزاماتنا التعاقدية تجاهك أو لاتخاذ خطوات سابقة للتعاقد بناءً على طلبك؛",
          "ضرورية للوفاء بالتزاماتنا القانونية أو التنظيمية وفقًا للتشريعات المعمول بها؛",
          "ضرورية لأداء مهمة تُنفَّذ للمصلحة العامة؛",
          "ضرورية لحماية المصالح الحيوية للفرد المعني أو لشخص طبيعي آخر؛",
          "ضرورية للمصالح المشروعة للغرير، دون المساس بشكل غير مبرر بمصالحك أو حقوقك وحرياتك الأساسية، وبالقدر الذي تكون فيه هذه البيانات الشخصية ضرورية تمامًا للغرض المقصود؛ أو",
          "في بعض الحالات، عندما يقتضي القانون المعمول به ذلك، إذا حصلنا على موافقتك المسبقة."
        ]
      },
      {
        "type": "p",
        "text": "قد نعالج البيانات الشخصية الحساسة في الحالات التالية:"
      },
      {
        "type": "ul",
        "items": [
          "بموافقتك الكتابية الصريحة؛",
          "عندما نحتاج إلى الوفاء بالتزاماتنا القانونية؛ أو",
          "عندما يكون ذلك ضروريًا للمصلحة العامة."
        ]
      }
    ]
  },
  {
    "id": "5-consent",
    "title": "5. الموافقة",
    "blocks": [
      {
        "type": "p",
        "text": "عندما نعالج بياناتك الشخصية بناءً على موافقتك، يحق لك سحب موافقتك في أي وقت. ولسحب موافقتك، يُرجى التواصل معنا باستخدام بيانات الاتصال الواردة في نهاية إشعار الخصوصية هذا. وبمجرد تلقي الغرير إشعارًا بسحب موافقتك، لن نعالج بياناتك الشخصية بعد ذلك للغرض (الأغراض) التي وافقت عليها في الأصل، ما لم يوجد أساس قانوني آخر للمعالجة. يُرجى ملاحظة أنه عندما تعتمد الغرير على موافقتك لمعالجة بياناتك الشخصية وتختار سحب موافقتك، فقد يؤثر قرارك على قدرتنا على تقديم خدماتنا الإلكترونية ومنتجاتنا وخدماتنا الأخرى."
      }
    ]
  },
  {
    "id": "6-sharing-of-personal-data",
    "title": "6. مشاركة البيانات الشخصية",
    "blocks": [
      {
        "type": "p",
        "text": "قد نشارك البيانات الشخصية للأغراض المبينة في القسم 3 من إشعار الخصوصية هذا مع:"
      },
      {
        "type": "ul",
        "items": [
          "مزودي الخدمات والمقاولين من الباطن من الأطراف الثالثة (بما في ذلك على سبيل المثال لا الحصر مزودي خدمات تقنية المعلومات)؛",
          "أي شركة تابعة للغرير؛ و",
          "أي سلطات مختصة، على سبيل المثال إذا كنا ملزمين قانونًا بالامتثال لطلب بشأن البيانات الشخصية."
        ]
      },
      {
        "type": "p",
        "text": "لا نبيع البيانات الشخصية أو نؤجرها أو نوزعها أو نتيحها تجاريًا بأي شكل آخر لأي طرف ثالث. وعندما ننقل بياناتك إلى مزودي خدمات من الأطراف الثالثة، نتخذ خطوات لضمان استيفائهم لمعايير أمن البيانات لدينا، بحيث تظل بياناتك الشخصية آمنة. بالإضافة إلى ذلك، لا نسمح لمزودي الخدمات من الأطراف الثالثة باستخدام بياناتك الشخصية لأغراضهم الخاصة، ولن نسمح لهم بمعالجة بياناتك الشخصية إلا لأغراض محددة ووفقًا لتعليماتنا."
      }
    ]
  },
  {
    "id": "7-storage-and-transfer-of-personal-data",
    "title": "7. تخزين البيانات الشخصية ونقلها",
    "blocks": [
      {
        "type": "p",
        "text": "ستُدار الخدمات الإلكترونية للغرير وتُشغَّل من دولة الإمارات العربية المتحدة. وستُعالج المعلومات التي تُجمع منك عبر الخدمات الإلكترونية داخليًا وتُخزن على خوادم موجودة في دولة الإمارات، ولا تُنقل خارج الدولة في السياق المعتاد لأعمالنا."
      },
      {
        "type": "p",
        "text": "لن ننقل بياناتك إلى خارج دولة الإمارات إلا في الحالات التالية:"
      },
      {
        "type": "ul",
        "items": [
          "إذا كانت الدولة أو الموقع الذي ننقل إليه بياناتك الشخصية يوفر مستوى حماية كافيًا وفق ما تعتمده الجهة التنظيمية المختصة بالبيانات.",
          "إذا قدّم الطرف الثالث الذي تُنقل إليه البيانات الشخصية ضمانات مناسبة تكفل أمن بياناتك الشخصية، بما يتماشى مع التشريعات المعمول بها، مثل إبرام البنود التعاقدية القياسية المعتمدة من المفوضية الأوروبية ومفوض حماية البيانات في مركز دبي المالي العالمي؛",
          "إذا حصلنا على موافقتك الصريحة على نقل البيانات المقترح بعد إبلاغك بأي مخاطر محتملة؛ أو إذا كان النقل ضروريًا لأحد الأسباب الأخرى بموجب التشريعات المعمول بها."
        ]
      },
      {
        "type": "p",
        "text": "بتقديمك بياناتك الشخصية إلى الخدمات الإلكترونية للغرير، فإنك تقر بهذا النقل أو التخزين أو المعالجة."
      },
      {
        "type": "p",
        "text": "ستتخذ الغرير جميع الخطوات اللازمة بشكل معقول لضمان التعامل مع بياناتك الشخصية بشكل آمن، ومنع الوصول إليها أو الإفصاح عنها دون تصريح، ووفقًا لإشعار الخصوصية هذا."
      },
      {
        "type": "p",
        "text": "إذا جرى نقل بعض بياناتك الشخصية إلى دول أو ولايات قضائية لا توفر قوانين حماية البيانات أو الخصوصية فيها مستوى كافيًا (ولايات قضائية غير كافية الحماية) مقارنةً بالتشريعات المعمول بها في مكان إقامتك، فسنتخذ التدابير المناسبة لحماية البيانات الشخصية وفقًا للتشريعات المعمول بها، على سبيل المثال من خلال وضع إطار قانوني مناسب لحماية بياناتك الشخصية."
      },
      {
        "type": "p",
        "text": "إذا كنت ترغب في الحصول على مزيد من التفاصيل حول كيفية حماية بياناتك الشخصية عند نقلها من دولة إلى أخرى، يُرجى مراسلتنا عبر البريد الإلكتروني على [DataProtection.Officer@al-ghurair.com](mailto:DataProtection.Officer@al-ghurair.com)."
      }
    ]
  },
  {
    "id": "8-your-data-protection-rights",
    "title": "8. حقوقك في حماية البيانات",
    "blocks": [
      {
        "type": "p",
        "text": "وفق شروط معينة، قد يحق لك أن تطلب منا ما يلي:"
      },
      {
        "type": "ul",
        "items": [
          "تزويدك بمزيد من التفاصيل حول استخدامنا لبياناتك الشخصية؛",
          "تأكيد ما إذا كنا نعالج بيانات شخصية تخصك، و(في هذه الحالة) تمكينك من الوصول إلى البيانات الشخصية التي نحتفظ بها عنك؛",
          "تحديث أي معلومات غير دقيقة في البيانات الشخصية التي نحتفظ بها عنك؛",
          "حذف أي من بياناتك الشخصية التي لم يعد لدينا أساس قانوني لاستخدامها؛",
          "عندما تستند المعالجة إلى الموافقة، إيقاف تلك المعالجة بسحب موافقتك (وهو ما يمكنك القيام به في أي وقت)؛",
          "الاعتراض على أي معالجة تستند إلى مصالحنا المشروعة، ما لم تكن أسبابنا للقيام بتلك المعالجة تفوق أي ضرر يلحق بحقوقك في حماية البيانات، أو الاعتراض على أغراض التسويق المباشر؛",
          "تقييد كيفية استخدامنا لبياناتك الشخصية أثناء التحقيق في شكوى؛ و/أو",
          "نقل بياناتك الشخصية إليك أو إلى طرف ثالث بصيغة موحدة قابلة للقراءة آليًا."
        ]
      },
      {
        "type": "p",
        "text": "يُرجى ملاحظة أن بعض الحقوق المذكورة أعلاه قد تكون محدودة عندما تكون لدينا مصلحة غالبة أو التزام قانوني بمواصلة معالجة بياناتك الشخصية أو بعدم الإفصاح عنها."
      },
      {
        "type": "p",
        "text": "ستُعالج طلباتك المتعلقة بالبيانات الشخصية التي جُمعت وفقًا لإشعار الخصوصية هذا والتشريعات المعمول بها."
      },
      {
        "type": "p",
        "text": "عند تقديمك طلبًا، سيتحقق فريقنا من هويتك لضمان أمن بياناتك الشخصية وخصوصيتها. ونهدف إلى الرد على جميع الطلبات ضمن المدد المحددة بموجب التشريعات المعمول بها. وفي حال كان طلبك معقدًا بشكل خاص، سنبلغك بذلك ونطلعك على المستجدات."
      },
      {
        "type": "p",
        "text": "لممارسة أي من حقوقك، يُرجى مراسلتنا على العنوان الوارد في نهاية إشعار الخصوصية هذا للإبلاغ عن مخاوفك، وسنتخذ الخطوات المناسبة لتلبية طلبك."
      },
      {
        "type": "p",
        "text": "إذا لم تكن راضيًا عن استخدامنا لبياناتك الشخصية أو عن ردنا على أي طلب قدمته لممارسة حقوقك، أو إذا كنت تعتقد أننا انتهكنا أيًا من التشريعات المعمول بها ذات الصلة، فيحق لك تقديم شكوى إلى السلطة التي تشرف على معالجتنا لبياناتك الشخصية."
      },
      {
        "type": "p",
        "text": "إذا شعرت بأننا لا نمتثل للتشريعات المعمول بها، يمكنك تقديم شكوى إلى سلطة حماية البيانات المختصة، وهي كما يلي:"
      },
      {
        "type": "p",
        "text": "مركز دبي المالي العالمي: مفوض حماية البيانات في مركز دبي المالي العالمي"
      },
      {
        "type": "p",
        "text": "دولة الإمارات العربية المتحدة: مكتب الإمارات للبيانات"
      },
      {
        "type": "p",
        "text": "الاتحاد الأوروبي: سلطة حماية البيانات في الدولة الأوروبية التي تقيم فيها"
      }
    ]
  },
  {
    "id": "9-children-s-privacy",
    "title": "9. خصوصية الأطفال",
    "blocks": [
      {
        "type": "p",
        "text": "لا تجمع الغرير عن علم معلومات الأطفال ولا تتواصل معهم، بما في ذلك لغرض المشاركة في أنشطة أبحاث العملاء. إذا كان عمرك 21 عامًا أو أقل، يُرجى الحصول على إذن والديك/ولي أمرك قبل تقديم أي بيانات شخصية عبر الخدمات الإلكترونية للغرير. ولا يُسمح للمستخدمين الذين تبلغ أعمارهم 21 عامًا أو أقل دون هذه الموافقة بتزويدنا ببيانات شخصية."
      }
    ]
  },
  {
    "id": "10-cookies",
    "title": "10. ملفات تعريف الارتباط",
    "blocks": [
      {
        "type": "p",
        "text": "ملفات تعريف الارتباط هي أجزاء صغيرة من المعلومات يخزنها متصفحك على جهاز الكمبيوتر الخاص بك عندما يطلب موقع إلكتروني ذلك. ولديك خيار ضبط متصفحك لرفض جميع ملفات تعريف الارتباط أو ملفات معينة منها، أو لإشعارك عندما تضع المواقع الإلكترونية ملفات تعريف الارتباط أو تصل إليها. يُرجى العلم أنه إذا عطّلت ملفات تعريف الارتباط أو رفضتها، فقد يتعذر الوصول إلى أجزاء معينة من الخدمات الإلكترونية أو قد لا تعمل بشكل صحيح. لمزيد من المعلومات حول ملفات تعريف الارتباط التي نستخدمها، يُرجى الرجوع إلى [سياسة ملفات تعريف الارتباط](https://www.lepasuae.com/cookie-policy)"
      }
    ]
  },
  {
    "id": "11-data-retention",
    "title": "11. الاحتفاظ بالبيانات",
    "blocks": [
      {
        "type": "p",
        "text": "سنحتفظ ببياناتك الشخصية للمدة اللازمة لتحقيق الأغراض التي جُمعت من أجلها، ما لم نتفق معك تحديدًا على مدة احتفاظ أطول، أو كانت مدة الاحتفاظ الأطول مطلوبة أو مسموحًا بها بموجب التشريعات المعمول بها."
      },
      {
        "type": "p",
        "text": "تستند مدد الاحتفاظ لدينا إلى متطلبات التشريعات المعمول بها ذات الصلة والغرض الذي جُمعت البيانات الشخصية واستُخدمت من أجله، مع مراعاة المتطلبات القانونية والتنظيمية للاحتفاظ بالبيانات الشخصية لمدة دنيا، ومدد التقادم لاتخاذ الإجراءات القانونية، والممارسات الجيدة، وأغراض أعمالنا. بالإضافة إلى ذلك، نأخذ في الاعتبار كمية البيانات الشخصية وطبيعتها وحساسيتها، والمخاطر المحتملة للضرر الناجم عن الاستخدام أو الإفصاح غير المصرح به لبياناتك الشخصية، والأغراض التي نعالج من أجلها بياناتك الشخصية، وما إذا كان بإمكاننا تحقيق تلك الأغراض بوسائل أخرى."
      },
      {
        "type": "p",
        "text": "سنتلف بياناتك الشخصية أو نجعلها مجهولة الهوية بمجرد انتهاء الغرض من جمعها، أو انتهاء المتطلب القانوني الذي يستوجب الاحتفاظ بها."
      },
      {
        "type": "p",
        "text": "يمكنك في أي وقت أن تطلب حذف معلوماتك المخزنة من قاعدة بيانات الغرير باستخدام بيانات الاتصال أدناه. ومع ذلك، قد يُحتفظ ببعض بياناتك الشخصية في ظروف معينة، مثل تسوية النزاعات، أو حل المشكلات، أو إنفاذ الشروط والأحكام، أو وفقًا لما تطلبه الجهات التنظيمية. علاوة على ذلك، في بعض الظروف لا تُحذف هذه البيانات الشخصية بالكامل من قواعد البيانات بسبب القيود التقنية والنسخ الاحتياطية للأنظمة."
      }
    ]
  },
  {
    "id": "12-how-we-protect-your-personal-data",
    "title": "12. كيف نحمي بياناتك الشخصية",
    "blocks": [
      {
        "type": "p",
        "text": "طبقنا تدابير إدارية وتقنية ومادية معقولة لحماية بياناتك الشخصية من الفقدان وسوء الاستخدام والتغيير. ومع ذلك، لا يمكن لأي موقع على الإنترنت أن يكون آمنًا بنسبة 100%، ولا يمكن تحميلنا مسؤولية أي وصول غير مصرح به أو غير مقصود يقع خارج نطاق سيطرتنا."
      },
      {
        "type": "p",
        "text": "وضعنا إجراءات للتعامل مع أي اختراق مشتبه به لأمن البيانات، وسنبلغك ونبلغ أي جهة تنظيمية معنية بأي اختراق مشتبه به عندما نكون ملزمين قانونًا بذلك."
      }
    ]
  },
  {
    "id": "13-profiling",
    "title": "13. التنميط",
    "blocks": [
      {
        "type": "p",
        "text": "لا تستخدم الغرير التنميط (حيث يستخدم نظام إلكتروني البيانات الشخصية لمحاولة التنبؤ بأمر ما يتعلق بك) أو اتخاذ القرارات الآلية (حيث يستخدم نظام إلكتروني البيانات الشخصية لاتخاذ قرار بشأنك دون تدخل بشري)."
      }
    ]
  },
  {
    "id": "14-hyperlinks",
    "title": "14. الروابط التشعبية",
    "blocks": [
      {
        "type": "p",
        "text": "قد توفر خدماتنا الإلكترونية روابط لمواقع إلكترونية تابعة لأطراف ثالثة لراحتك. وإذا دخلت إلى تلك الروابط، فستغادر خدماتنا الإلكترونية. نحن لا نتحكم في تلك المواقع التابعة لأطراف ثالثة أو في ممارسات الخصوصية الخاصة بها، والتي قد تختلف عن ممارساتنا، ولا نؤيد تلك المواقع أو نقدم أي إقرارات بشأنها. ولا يشمل إشعار الخصوصية هذا البيانات الشخصية التي تختار تقديمها إلى أطراف ثالثة غير ذات صلة. ونشجعك على مراجعة إشعار الخصوصية الخاص بأي شركة قبل تقديم بياناتك الشخصية. وقد تختار بعض الشركات التابعة لأطراف ثالثة مشاركة بيانات شخصية معنا؛ وتخضع هذه المشاركة لسياسة الخصوصية الخاصة بتلك الشركة."
      }
    ]
  },
  {
    "id": "15-local-differences",
    "title": "15. الاختلافات المحلية",
    "blocks": [
      {
        "type": "p",
        "text": "في حين يصف إشعار الخصوصية هذا ممارسات حماية البيانات التي نتبعها بشكل عام في دولة الإمارات (البر الرئيسي ومركز دبي المالي العالمي) والاتحاد الأوروبي، فقد تختلف قوانين حماية البيانات المحلية، وقد تعني عملياتنا في بعض الدول أننا نخضع لمتطلبات محلية مختلفة أو إضافية لحماية البيانات. وكما هو موضح أعلاه، سيُستكمل إشعار الخصوصية هذا بملاحق خاصة بكل ولاية قضائية من وقت لآخر حسب الاقتضاء."
      }
    ]
  },
  {
    "id": "16-changes-to-the-privacy-notice",
    "title": "16. التغييرات على إشعار الخصوصية",
    "blocks": [
      {
        "type": "p",
        "text": "نحدّث إشعار الخصوصية هذا لضمان الامتثال للتشريعات المعمول بها. وإذا كنا سنستخدم بياناتك الشخصية بطريقة تختلف عما ذُكر وقت جمعها، فسنبلغك بذلك. وتصبح جميع التغييرات سارية عند نشرها ما لم يُذكر خلاف ذلك."
      },
      {
        "type": "p",
        "text": "يُرجى مراجعة إشعار الخصوصية هذا بشكل دوري للاطلاع على أي تغييرات."
      },
      {
        "type": "p",
        "text": "آخر تحديث لإشعار الخصوصية هذا كان في أغسطس 2026."
      }
    ]
  },
  {
    "id": "17-contact-details",
    "title": "17. بيانات الاتصال",
    "blocks": [
      {
        "type": "p",
        "text": "إذا كانت لديك أي مخاوف بشأن امتثالنا للتشريعات المعمول بها أو لإشعار الخصوصية هذا، يُرجى استخدام بيانات الاتصال أدناه:"
      },
      {
        "type": "h3",
        "text": "مسؤول حماية البيانات"
      },
      {
        "type": "p",
        "text": "الغرير – المكتب الرئيسي"
      },
      {
        "type": "p",
        "text": "دبي، الإمارات العربية المتحدة"
      },
      {
        "type": "p",
        "text": "صندوق بريد رقم 5326"
      },
      {
        "type": "p",
        "text": "البريد الإلكتروني: [DataProtection.Officer@al-ghurair.com](mailto:DataProtection.Officer@al-ghurair.com)"
      },
      {
        "type": "p",
        "text": "سنسعى للرد على مخاوفك في أقرب وقت ممكن."
      }
    ]
  }
],
  },
};
