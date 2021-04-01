def _input()
	f = File.open('2020-19-input')
	f.read.split("\n\n").map { |l| l.split "\n"}
end

_rules, data = _input()

# 33: "a"
# 123: "b"
# 8: 42
# 11: 42 31
# 89: 33 | 123
# 58: 9 33 | 63 123


$rules = _rules.map { |r| m = r.match(/: /); [m.pre_match, m.post_match.split(' ')] }.to_h
$rules_pre = {}

# pp $rules

def process_rule(rn)
	return $rules_pre[rn] unless $rules_pre[rn].nil?

	res = ''
	r = $rules[rn]

	case r.size
	when 1
		m = r[0].match /\"(\w)\"/
		res = m ? m[1] : process_rule(r[0])
	when 2
		res = process_rule(r[0]) + process_rule(r[1])
	when 3
		# res = process_rule(r[0]) + process_rule(r[1]) + process_rule(r[2])
		res = '(' + process_rule(r[0]) + '|' + process_rule(r[2]) + ')'
	when 5
		res = '(' + process_rule(r[0]) + process_rule(r[1]) + '|' + process_rule(r[3]) + process_rule(r[4]) + ')'
	end

	$rules_pre[rn] = res
end

#1
rule = '^' + process_rule('0') + '$'
# p rule
out = data.filter { |s| s.match rule  }
p "1: #{out.size}"

#2
# 0: 8 11 → [42]+[42]=[31]=
# 8: 42 | 42 8
# 11: 42 31 | 42 11 31

# 42: 33 35 | 123 21
# 31: 123 114 | 33 10

rule42 = '^(' + process_rule('42') + ')+'
rule31 = '(' + process_rule('31') + ')+$'

out = data.filter { |s|
	m42 = s.match rule42
	m31 = s.match rule31
	m42 && m31 && (m42[0].size + m31[0].size == s.size) && (m42[0].size / m42[1].size) > (m31[0].size / m31[1].size)
	# p m42[0], m42[1], m31[0], m31[1], "" if res
}

p "2: #{out.size}"
