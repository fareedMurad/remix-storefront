import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { Price } from '../products/Price';
import { t } from 'i18next';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 10,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerValue: {
    fontSize: 12,
    color: 'gray',
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 11,
    color: 'gray',
  },
  lineSection: {
    padding: 10,
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
  },
  image: {
    width: 96,
    height: 96,
  },
  lineBox: {
    flexDirection: 'column',
    gap: '10px',
  },
  placeholderImage: {
    border: '1px solid',
    borderRadius: '2px',
    backgroundColor: '#FFF',
  },
});

const DownloadOrdersTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ width: '100%', flexGrow: 1 }}>
        <View style={styles.section}>
          <View>
            <Text style={styles.headerLabel}>Order Placed</Text>
            <Text style={styles.headerValue}>
              {data?.orderPlacedAt
                ? new Date(data.orderPlacedAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '--'}
            </Text>
          </View>
          <View>
            <Text style={styles.headerLabel}>Total sum</Text>
            <Text style={styles.headerValue}>
              <Price
                currencyCode={data?.currencyCode}
                priceWithTax={data?.totalWithTax}
              ></Price>
            </Text>
          </View>
          <View>
            <Text style={styles.headerLabel}>Order number</Text>
            <Text style={styles.headerValue}>{data?.code || '--'}</Text>
          </View>
        </View>
        {data?.lines.map((line: any, key: number) => (
          <View style={styles.lineSection} key={key}>
            {line.featuredAsset?.source ? (
              <Image style={styles.image} src={line.featuredAsset?.source} />
            ) : (
              <View style={{ ...styles.image, ...styles.placeholderImage }} />
            )}
            <View style={styles.lineBox}>
              <Text style={styles.label}>{line.productVariant.name}</Text>
              <View
                style={{ ...styles.value, flexDirection: 'row', gap: '10px' }}
              >
                <Text>{line.quantity}</Text>
                <Text>x</Text>
                <Text>
                  <Price
                    currencyCode={line.productVariant.currencyCode}
                    priceWithTax={line.discountedUnitPriceWithTax}
                  ></Price>
                </Text>
                <Text>Ξ</Text>
                <Text>
                  <Price
                    currencyCode={line.productVariant.currencyCode}
                    priceWithTax={line.discountedLinePriceWithTax}
                  ></Price>
                </Text>
              </View>
            </View>
            <View>
              {line.fulfillmentLines?.reduce(
                (acc: any, fLine: any) => acc + fLine.quantity,
                0,
              ) === 0
                ? t('order.notShipped')
                : `${line.fulfillmentLines?.reduce(
                    (acc: any, fLine: any) => acc + fLine.quantity,
                    0,
                  )} ${t('common.or')} ${line.quantity} ${t(
                    'order.items.fulfilled',
                  )}`}
              {line.fulfillmentLines
                ?.filter((fLine: any) => fLine.quantity > 0)
                .map((fLine: any, key: any) => (
                  <Text style={styles.value}>
                    {fLine.fulfillment.state}:{' '}
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'medium',
                    }).format(new Date(fLine.fulfillment.updatedAt))}
                  </Text>
                ))}
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default DownloadOrdersTemplate;
