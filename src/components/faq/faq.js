import style from './faq.module.scss'
import {useTranslation} from "react-i18next";

const faqList = [
    {
        title: 'FAQ1Title',
        content: [
            'FAQ1Content',
        ]
    },
    {
        title: 'FAQ2Title',
        content: [
            'FAQ2Content1',
            'FAQ2Content2',
            'FAQ2Content3',
        ],
    },
    {
        title: 'FAQ3Title',
        content: [
            'FAQ3Content1',
            'FAQ3Content2',
        ],
    },

    {
        title: 'FAQ4Title',
        content: [
            'FAQ4Content',
        ],
    },
    {
        title: 'FAQ5Title',
        content: [
            'FAQ5Content'
        ]
    }

]

export function Faq() {
    const {t} = useTranslation();
    return (
        <div className={style.faq}>
            <div className={style.title}>{t('FAQs')}</div>

            <div className={style.faqList}>

                {
                    faqList.map((item, index) =>
                        <div className={style.row} key={index}>
                            <div className={style.rowTitle}>
                                <span>{index + 1}.</span>{t(item.title)}
                            </div>
                            <div className={style.rowContent}>
                                {item.content.map((key, i) => <p key={i}>{t(key)}</p>)}
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
}